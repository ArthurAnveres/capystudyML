import React, { useEffect, useState } from 'react'
import { Navbar } from '../../components/navbar'
import { Footer } from '../../components/footer'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Button } from '@nextui-org/button'
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal'
import { useForm } from 'react-hook-form'
import { Input, Textarea } from '@nextui-org/input'
import axios from 'axios'
import { FlipCard } from '../../components/flipCard'
import { Divider } from '@nextui-org/divider'

export const Flash = () => {
    const [cards, setCards] = useState([])
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            token: localStorage.getItem("token"),
            title: '',
            quest: '',
            answer: ''
        }
    })

    const getCards = () => {
        axios.post("http://localhost:3333/mostrar", { token: localStorage.getItem("token") })
            .then((res) => {
                setCards(res.data.cards);
            })
            .catch((err) => {
                console.error("Erro ao buscar cards:", err);
            });
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            window.location.replace("/login")
        }

        if (!isOpen) {
            getCards()
        }
    }, [isOpen])

    const onSubmit = (data) => {
        axios.post("http://localhost:3333/criar", data)
            .then((res) => {
                reset()
                onClose()
            })
    }

    return (
        <>
            <div className='w-screen h-screen flex flex-col'>
                <Navbar />
                <div className='w-screen h-full my-8 px-8'>
                    <Card classNames={{
                        header: "bg-[#f8f8f8]"
                    }} className='h-full'>
                        <CardHeader className='text-[#bb6232] font-medium text-xl flex justify-between'>
                            Lista de cards
                            <Button radius='sm' className='bg-[#bb6232] text-[#e2dbd8]' onPress={onOpen}>Criar</Button>
                        </CardHeader>
                        <Divider />
                        <CardBody className='flex flex-row max-md:justify-center flex-wrap gap-6 my-4'>
                            {
                                cards.length > 0 ? cards.map((card, key) => {
                                    return <FlipCard key={key} title={card.titulo} quest={card.pergunta} answer={card.resposta} id={card.id} onDelete={getCards}/>
                                })
                                    : (
                                        <span>Nenhum card encontrado para este usuário.</span>
                                    )
                            }
                        </CardBody>
                    </Card>
                </div>
                <Modal backdrop='blur' size='xl' classNames={{ header: "bg-[#f8f8f8]" }} isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-[#bb6232] font-medium text-xl">Cadastro de cards</ModalHeader>
                                <ModalBody>
                                    <form className='flex flex-col gap-4 my-4' onSubmit={handleSubmit(onSubmit)}>
                                        <Input
                                            type='text'
                                            variant='bordered'
                                            label='Título'
                                            {...register('title', {
                                                required: 'Um título é obrigatório'
                                            })}
                                            color={errors.title ? "danger" : "default"}
                                            isInvalid={errors.title}
                                            errorMessage={errors.title ? errors.title.message : ""}
                                        />
                                        <Textarea
                                            type='text'
                                            variant='bordered'
                                            label='Pergunta'
                                            {...register('quest', {
                                                required: 'A pergunta é obrigatório'
                                            })}
                                            color={errors.quest ? "danger" : "default"}
                                            isInvalid={errors.quest}
                                            errorMessage={errors.quest ? errors.quest.message : ""}
                                        />
                                        <Textarea
                                            type='text'
                                            variant='bordered'
                                            label='Resposta'
                                            {...register('answer', {
                                                required: 'A resposta é obrigatório'
                                            })}
                                            color={errors.answer ? "danger" : "default"}
                                            isInvalid={errors.answer}
                                            errorMessage={errors.answer ? errors.answer.message : ""}
                                        />
                                        <input className='self-end bg-[#bb6232] rounded-md py-2 px-6 text-white cursor-pointer' type='submit' value="Criar" />
                                    </form>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <Footer size={4} />
            </div>
        </>
    )
}
