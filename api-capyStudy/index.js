const connection = require('./modules/database')
const crypto = require('crypto-random-string')
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const enviarEmail = require('./modules/mailersend')

const app = express()

app.use(cors())
app.use(fileUpload())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//#region Verificação das requisições de senha
setInterval(() => {
    const now = new Date()
    connection.query("SELECT * FROM esqueci", [],
        (err, results) => {
            if (results.length === 0) {
                return
            }
            for (const result of results) {
                if (result.vencimento < now) {
                    connection.query("DELETE FROM esqueci WHERE id = ?",
                        [result.id],
                        (err, r) => {
                            if (err) {
                                return console.log("Erro ao excluir requisição")
                            }
                            return
                        }
                    )
                }
                return
            }
        }
    )
}, 1000 * 60)
//#endregion

//#region Detalhes
app.get('/detalhes', (req, res) => {
    const { token, query } = req.query

    connection.query(`SELECT ${query} FROM usuarios WHERE token = ?`,
        [token],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: "Erro ao encontrar usuário" })
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Esse token não existe" })
            }

            return res.status(200).json(results[0])
        }
    )

})

app.post('/detalhes', (req, res) => {
    const { token, name, email } = req.body

    try {
        if (email !== "") {
            connection.query("SELECT * FROM usuarios WHERE email = ?", [email],
                (err, results) => {
                    if (results.length > 0) {
                        return res.status(404).json({ message: "Email já existe" })
                    }
                    connection.execute("UPDATE usuarios SET email = ? WHERE token = ?", [email, token])
                }
            )
        }

        if (name !== "") {
            connection.execute("UPDATE usuarios SET nome = ? WHERE token = ?", [name, token])
        }

        return res.status(200).json({ message: "Informações atualizadas com sucesso" })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "Erro ao atualizar informações" })
    }
})

app.patch('/detalhes', (req, res) => {
    const { token, actual, newP } = req.body

    try {
        connection.query("SELECT senha FROM usuarios WHERE token = ?",
            [token],
            (err, results) => {
                if (results[0].senha === actual) {
                    connection.execute("UPDATE usuarios SET senha = ? WHERE token = ?", [newP, token])
                    return res.status(200).json({ message: "Senha atualizada com sucesso" })
                    }
                return res.status(404).json({ message: "Senha atual errada" })
            }
        )

        return res.status(200).json({ message: "Senha atualizada com sucesso" })
    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: "Erro ao atualizar informações" })
    }

})
//#endregion

//#region Alterar imagem
app.post('/alterarimagem', (req, res) => {
    const { token } = req.body
    const { imagem } = req.files
    const data = Buffer.from(imagem.data)

    if (!token) {
        return res.status(404).json({ message: "Token não encontrado" })
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(404).send({ message: "Nenhum arquivo enviado" })
    }

    connection.query("UPDATE usuarios SET imagem = ? WHERE token = ?",
        [data, token],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: "Erro ao atualizar a imagem" })
            }

            return res.status(200).json({ message: "Imagem atualizada com sucesso" })
        }
    )
})

app.delete('/deletarimagem', (req, res) => {
    const { token } = req.query

    if (!token) {
        return res.status(404).json({ message: "Token não encontrado" })
    }

    connection.query("UPDATE usuarios SET imagem = NULL WHERE token = ?",
        [token],
        (err, results) => {
            if (err) {
                console.log(err)
                return res.status(404).json({ message: "Erro ao deletar imagem" })
            }

            return res.status(200).json({ message: "Imagem deletada" })

        }
    )
})
//#endregion

//#region Autenticação
app.post('/login', (req, res) => {
    const { email, password } = req.body

    connection.query('SELECT *  FROM `usuarios` WHERE `email` LIKE ?', [email],
        (err, result) => {
            if (result[0].length === 0) {
                return res.status(404).json({ message: 'Sua senha está incorreta' })
            } else {
                let emailDB = result[0].email;
                let passwordDB = result[0].senha;
                let tokenDB = result[0].token;

                if (email === emailDB && password === passwordDB) {
                    return res.status(200).json({ token: tokenDB })
                } else {
                    return res.status(404).json({ message: 'Sua senha está incorreta' })
                }
            }
        })
})

app.post('/registrar', (req, res) => {
    const { email, password, name, birth } = req.body

    const token = crypto({ length: 64, type: 'url-safe' })

    if (password <= 8) {
        return res.status(404).json({ message: 'Senha muito curta' })
    }

    const regex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/
    if (!regex.test(email)) {
        return res.status(404).json({ message: 'Email não validado' })
    }

    connection.query('SELECT * FROM usuarios WHERE email = ?',
        [email],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: 'Erro ao verificar o email' })
            }
            if (results.length > 0) {
                return res.status(404).json({ message: 'Email já existe' })
            }
        }
    )

    connection.query('INSERT INTO usuarios(email, senha, token, nome, data_nascimento) VALUES (?, ?, ?, ?, ?)',
        [email, password, token, name, birth],
        (err) => {
            if (err) {
                return res.status(404).json({ message: 'Usuário não registrado' })
            } else {
                return res.status(200).json({ message: 'Usuário registrado com sucesso', token: token })
            }
        })
})
//#endregion

//#region Cards
app.post('/criar', (req, res) => {
    const { title, quest, answer, token } = req.body

    connection.query("SELECT id FROM usuarios WHERE token = ?", [token],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: "Erro ao buscar o usuário." })
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            }

            const userID = results[0].id

            connection.query("INSERT INTO cards (titulo, pergunta, resposta, id_usuario) VALUES (?, ?, ?, ?)",
                [title, quest, answer, userID],
                (err, results) => {
                    if (err) {
                        return res.status(404).json({ message: "Erro ao buscar o usuário." })
                    }

                    return res.status(200).json({ message: "Criado com sucesso" })
                }
            )
        }
    )
})

app.post('/mostrar', (req, res) => {
    const { token } = req.body

    connection.query("SELECT id FROM usuarios WHERE token = ?", [token],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: "Erro ao buscar o usuário." })
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            }

            const userID = results[0].id

            connection.query("SELECT * FROM cards WHERE id_usuario",
                [],
                (err, results) => {
                    if (err) {
                        return res.status(404).json({ message: "Erro ao buscar o usuário." })
                    }

                    return res.status(200).json({ cards: results })
                }
            )
        }
    )
})

app.post('/deletarcard', (req, res) => {
    const { token, cardId } = req.body

    connection.query("SELECT id FROM usuarios WHERE token = ?", [token],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: "Erro ao buscar o card." })
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Card não encontrado." })
            }

            const userID = results[0].id

            connection.query("DELETE FROM cards WHERE id = ? AND id_usuario = ?",
                [cardId, userID],
                (err, results) => {
                    if (err) {
                        return res.status(404).json({ message: "Erro ao buscar o card." })
                    }

                    return res.status(200).json({ message: "Excluído com sucesso" })
                }
            )
        }
    )
})
//#endregion

//#region Forget password
app.post('/esqueci', (req, res) => {
    const { email } = req.body

    connection.query("SELECT * FROM usuarios WHERE email = ?", [email],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: "Erro ao buscar o email." })
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Usuário não encontrado." })
            }

            const userID = results[0].id
            const nome = results[0].nome
            const email = results[0].email
            const token = crypto({ type: "url-safe", length: 64 })

            connection.query("SELECT * FROM esqueci WHERE id_usuario = ?",
                [userID],
                (err, results) => {
                    if (err) {
                        return res.status(404).json({ message: "Erro ao procurar requisição feita." })
                    }

                    if (results.length !== 0) {
                        return res.status(404).json({ message: "Você já fez, o link tem duração de 24 horas" })
                    }

                    connection.query("INSERT INTO esqueci (token, id_usuario) VALUES (?, ?)",
                        [token, userID],
                        async (err, results) => {
                            if (err) {
                                return res.status(404).json({ message: "Erro ao inserir sua requisição." })
                            }

                            enviarEmail(nome, `http://localhost:3000/esqueci/${token}`, email)
                            return res.status(200).json({ message: "Confira seu email" })

                        }
                    )
                }
            )

        }
    )
})

app.get('/esqueci', (req, res) => {
    const { token } = req.query

    connection.query("SELECT token FROM esqueci WHERE token = ?",
        [token],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: "Erro ao buscar token." })
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Token não encontrado" })
            }

            return res.status(200).json({ message: "Token existe" })
        }
    )
})

app.patch('/esqueci', (req, res) => {
    const { token, password } = req.body

    connection.query("SELECT * FROM esqueci WHERE token = ?",
        [token],
        (err, results) => {
            if (err) {
                return res.status(404).json({ message: "Erro ao buscar token." })
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Token não encontrado" })
            }

            const userID = results[0].id_usuario

            connection.query("DELETE FROM esqueci WHERE token = ?", [token])

            connection.query("UPDATE usuarios SET senha = ? WHERE id = ?",
                [password, userID],
                (err, results) => {
                    if (err) {
                        return res.status(404).json({ message: "Erro ao alterar senha." })
                    }
                    return res.status(200).json({ message: "Alteração feita com sucesso" })
                }
            )

        }
    )

})
//#endregion

app.listen('3333', () => {
	console.log("Eu funciono")
})