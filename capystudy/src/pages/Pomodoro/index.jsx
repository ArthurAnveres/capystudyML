import React, { useState } from 'react'
import { Navbar } from '../../components/navbar'
import { Footer } from '../../components/footer'
import { Card, CardBody } from '@nextui-org/card'
import { Divider } from '@nextui-org/divider'
import { Button, ButtonGroup } from '@nextui-org/button'
import Countdown, { zeroPad } from 'react-countdown'
import CircularTimer from '../../components/clock'
import { Tooltip } from '@nextui-org/tooltip'

import logo from "../../assets/images/CapStudy simbolo.png"
import sound from "../../assets/sounds/alarm.mp3"

export const Pomodoro = () => {
    const [help, setHelp] = useState(false)
    const [initial, setInitial] = useState(true)
    const [duration, setDuration] = useState(0)
    const [rest, setRest] = useState(false)

    const toggleTooltip = () => {
        setHelp(!help)
    }

    const Completionist = () => {
        if (initial) {
            document.title = "Capy Study"
            return <span className='text-white font-medium text-3xl select-none'>Escolha uma opção!</span>
        }

        if (rest) {
            document.title = "Capy Study | Hora de estudar!"
            return (
                <>
                    <span className='text-white font-medium text-4xl select-none'>Hora de estudar!</span>
                    <audio src={sound} autoPlay loop />
                </>
            )
        } else {
            document.title = "Capy Study | Hora da pausa!"
            return (
                <>
                    <span className='text-white font-medium text-4xl select-none'>Hora da pausa!</span>
                    <audio src={sound} autoPlay loop />
                </>
            )
        }
    };

    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            return <Completionist />
        } else {
            document.title = `Capy Study | ${zeroPad(minutes)}:${zeroPad(seconds)}`
            return (
                <span className='text-white text-6xl font-medium select-none'>{zeroPad(minutes)}:{zeroPad(seconds)}</span>
            )
        }
    }

    function timer(duration = 0, rest = false) {
        if (initial) {
            setInitial(false)
        }

        if (rest) {
            setRest(true)
        }

        setDuration(duration)
    }

    return (
        <>
            <div className='w-screen h-screen flex flex-col justify-between'>
                <Tooltip
                    content={
                        <div className='px-1 py-2'>
                            <h4 className='text-base font-medium text-center'>Ciclo do Pomodoro:</h4>
                            <ul className='text-center text-base'>
                                <li>- Pomodoro</li>
                                <li>- Pausa curta</li>
                                <li>- Pomodoro</li>
                                <li>- Pausa curta</li>
                                <li>- Pomodoro</li>
                                <li>- Pausa longa</li>
                                <li>- Repita tudo denovo!</li>
                            </ul>
                        </div>
                    }
                    classNames={{
                        content: [
                            "py-2 px-4 shadow-xl",
                            "text-white bg-gradient-to-br from-[#708251] to-[#798251]"
                        ],
                        base: [
                            "before:bg-[#708251]"
                        ]
                    }}
                    isOpen={help}
                    showArrow
                    offset={-7}
                >
                    <div onClick={() => toggleTooltip()} className='bg-[#798251] fixed md:bottom-20 md:right-20 bottom-6 right-20 w-14 h-14 rounded-full z-50 flex justify-center items-center font-medium text-3xl text-white select-none cursor-help'>?</div>
                </Tooltip>
                <Navbar />
                <div className='w-screen flex flex-row max-md:flex-col max-md:my-8 gap-6 justify-center px-8'>
                    {/* Informações */}
                    <div className='container flex flex-col items-center gap-6 select-none'>
                        <div className='flex items-center gap-4'>
                            <img src={logo} width={32} alt='Logo'/>
                            <h1 className='text-[#bb6232] text-3xl font-medium'>Benefícios do método pomodoro</h1>
                        </div>
                        <Card className='max-w-[400px]'>
                            <CardBody className='gap-4'>
                                <div>
                                    <h5 className='text-xl font-medium'>Aumento do foco e concentração</h5>
                                    <span>O tempo limitado de trabalho ajuda a manter a mente focada na tarefa.</span>
                                </div>
                                <Divider />
                                <div>
                                    <h5 className='text-xl font-medium'>Prevenção da Fadiga</h5>
                                    <span>As pausas regulares evitam o cansaço mental e físico.</span>
                                </div>
                                <Divider />
                                <div>
                                    <h5 className='text-xl font-medium'>Melhora da Gestão do Tempo</h5>
                                    <span>Ajuda a entender melhor quanto tempo as tarefas realmente levam para serem concluídas.</span>
                                </div>
                                <Divider />
                                <div>
                                    <h5 className='text-xl font-medium'>Redução da Procrastinação</h5>
                                    <span>A estrutura do método incentiva o início imediato das tarefas.</span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    {/* Relógio */}
                    <div className='container flex flex-col items-center gap-6'>
                        <div>
                            <ButtonGroup fullWidth size='lg' className='max-sm:scale-[0.7]' variant='flat'>
                                <Button onClick={() => timer(1500, false)} className='bg-[#bb6232] text-white'>Pomodoro</Button>
                                <Divider orientation='vertical' />
                                <Button onClick={() => timer(300, true)} className='bg-[#bb6232] text-white'>Pausa curta</Button>
                                <Divider orientation='vertical' />
                                <Button onClick={() => timer(900, true)} className='bg-[#bb6232] text-white'>Pausa longa</Button>
                                <Divider orientation='vertical' />
                                <Button onClick={() => { timer(0, false); setInitial(true) }} className='bg-[#bb6232] text-white'>Resetar</Button>
                            </ButtonGroup>
                        </div>
                        <div className='bg-[#bb6232] rounded-full max-sm:scale-90'>
                            <CircularTimer duration={duration} size={352} width={24} color="#5f3300">
                                <Countdown
                                    date={Date.now() + (duration * 1000)}
                                    renderer={renderer}
                                    zeroPadTime={2}
                                    key={duration * 1000}
                                />
                            </CircularTimer>
                        </div>
                    </div>
                </div>
                <Footer size={4} />
            </div>
        </>
    )
}
