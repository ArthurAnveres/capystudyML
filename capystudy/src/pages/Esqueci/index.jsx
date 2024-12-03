import React, { useState } from 'react'
import logo from '../../assets/images/logo.png'
import { Input } from '@nextui-org/input'
import { Link } from '@nextui-org/link'
import { Button } from '@nextui-org/button'
import { useForm } from 'react-hook-form'
import axios from 'axios'

export const Forget = () => {
    const [message, setMessage] = useState("")
    const { register, handleSubmit, formState: { errors } } = useForm()


    const onSubmit = (data) => {
        setMessage("")
        axios.post("http://localhost:3333/esqueci", data)
        .then((res) => {
            setMessage(res.data.message)
        })
        .catch((err) => {
            setMessage(err.response.data.message)
        })
    }

    return (
        <div className='w-screen h-screen flex justify-center items-center bg-[#e2dbd8]'>
            <div className='flex flex-col gap-4 bg-white px-4 py-8 rounded-md shadow-md'>
                <form className='flex flex-col gap-3' onSubmit={handleSubmit(onSubmit)}>
                    <img src={logo} className='select-none' alt='Logo' />
                    <Input
                        type='email'
                        variant='bordered'
                        label="Email"
                        {...register("email", {
                            required: 'O email é obrigatório',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: 'Email inválido'
                            }
                        })}
                        color={errors.email ? "danger" : "default"}
                        isInvalid={errors.email}
                        errorMessage={errors.email ? errors.email.message : ""}
                    />
                    <span className={['text-sm text-center font-medium font-mono select-none', ]}>{message}&nbsp;</span>
                    <div>
                        <input className='bg-[#bb6232] w-full rounded-md py-2 text-white cursor-pointer' type='submit' value="Esqueci minha senha!" />
                    </div>
                </form>
                <Button radius='sm' variant='faded' href='/login' as={Link}>Voltar</Button>
            </div>
        </div>
    )
}
