import React, { useEffect, useState } from "react"
import logo from "../../assets/images/CapStudy- logotipoVertical.png"
import { motion } from "framer-motion"
import { User } from "@nextui-org/user"
import axios from "axios"
import { Button } from "@nextui-org/button"
import { Link } from "@nextui-org/link"

export const Navbar = ({ showUser = true }) => {
    const [details, setDetails] = useState()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const token = localStorage.getItem("token")

    useEffect(() => {
        if (token) {
            axios.get(`http://localhost:3333/detalhes?token=${token}&query=nome,imagem`)
                .then((res) => {
                    setDetails(res.data)
                })
                .catch((err) => {
                    localStorage.removeItem("token")
                    window.location.reload()
                })
        }
    }, [])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const Logout = () => {
        localStorage.removeItem("token")
        window.location.reload()
    }

    return (
        <>
            {/* Navbar para desktop */}
            <div className="select-none bg-[#e2dbd8] w-full h-16 flex justify-between px-4 sticky top-0 max-md:hidden z-30">
                <div className="h-full flex items-center gap-6">
                    <img src={logo} className="h-3/5 justify-self-start" alt="Logo" />
                    <a href="/" className="text-[#bb6232]">Página Inicial</a>
                    <a href="/pomodoro" className="text-[#bb6232]">Pomodoro</a>
                    <a href="flash" className="text-[#bb6232]">Flash Card</a>
                </div>
                <div className="h-full flex items-center gap-6">
                    {showUser && (
                        token ?
                            (
                                details && (
                                    <>
                                        <User
                                            name={`Olá, ${details.nome}`}
                                            description={(
                                                <div className="flex justify-between">
                                                    <Link className="cursor-pointer" onClick={() => window.location.replace("/perfil")} size="sm" isExternal>
                                                        Perfil
                                                    </Link>
                                                    <Link className="cursor-pointer" onClick={() => Logout()} size="sm" isExternal>
                                                        Sair
                                                    </Link>
                                                </div>
                                            )}
                                            classNames={{
                                                description: "w-full",
                                            }}
                                            avatarProps={{
                                                name: details.nome[0],
                                                src: details.imagem ? URL.createObjectURL(new Blob([new Uint8Array(details.imagem.data)], { type: 'image/jpeg'})) : "",
                                                classNames: {
                                                    base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                                                    icon: "text-black/80",
                                                    name: "text-xl font-medium",
                                                }
                                            }}
                                        />
                                    </>
                                )
                            )
                            :
                            (
                                <>
                                    <a href="/login" className="border border-[#bb6232] text-[#bb6232] py-1.5 px-3 rounded-md">Login</a>
                                    <a href="/registrar" className="bg-[#bb6232] text-[#e2dbd8] py-1.5 px-3 rounded-md">Cadastre-se</a>
                                </>
                            )
                    )
                    }
                </div>
            </div>

            {/* Navbar para mobile */}
            <div className="hidden max-md:flex select-none bg-[#e2dbd8] w-full h-16 items-center justify-between px-4 sticky z-10">
                <img src={logo} className="h-3/5" alt="Logo" />
                <button className="text-[#bb6232] focus:outline-none" onClick={toggleMenu}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Menu hamburguer */}
            <motion.div
                initial={{ height: 0, paddingBottom: 0 }}
                animate={{ height: isMenuOpen ? "auto" : 0, paddingBottom: isMenuOpen ? 10 : 0 }}
                transition={{ duration: 0.3 }}
                className="hidden max-md:flex bg-[#e2dbd8] w-full flex-col items-start gap-6 top-0 px-8 z-10 overflow-hidden shadow-md"
            >
                <a href="/" className="text-[#bb6232]">Página Inicial</a>
                <a href="/pomodoro" className="text-[#bb6232]">Pomodoro</a>
                <a href="flash" className="text-[#bb6232]">Flash Card</a>
                {
                    token ?
                        (
                            <>
                                <a href="#" onClick={() => Logout()} className="bg-[#bb6232] text-[#e2dbd8] py-1.5 px-6 rounded-md">Sair</a>
                            </>
                        )
                        :
                        (
                            <>
                                <a href="/login" className="border border-[#bb6232] text-[#bb6232] py-1.5 px-3 rounded-md">Login</a>
                                <a href="/registrar" className="bg-[#bb6232] text-[#e2dbd8] py-1.5 px-3 rounded-md">Cadastre-se</a>
                            </>
                        )
                }
            </motion.div>
        </>
    )
}
