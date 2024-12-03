import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { motion } from 'framer-motion';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';

import trash from '../../assets/images/trash-solid.svg'
import axios from 'axios';

export const FlipCard = ({ title, quest, answer, id, onDelete }) => {
    const [flipped, setFlipped] = useState(false);

    const deleteCard = (id) => {
        axios.post("http://localhost:3333/deletarcard", {
            token: localStorage.getItem("token"),
            cardId: id
        })
        .then(() => {
            if (onDelete) onDelete()
        })
    }

    return (
        <motion.div
            className="flip-card-container"
            onClick={() => setFlipped(!flipped)}
            style={{
                perspective: '1000px',
                cursor: 'pointer',
                width: '320px',
                height: '250px',
                margin: '16px',
            }}
        >
            <motion.div
                className="flip-card"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Frente do Card */}
                <Card
                    className="flip-card-front"
                    classNames={{
                        header: "bg-[#f8f8f8]"
                    }}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transform: 'rotateY(0deg)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <CardHeader>
                        <span className='text-[#bb6232] font-medium text-lg truncate hover:text-wrap w-full'>{title}</span>
                        <Button isIconOnly color='danger' onClick={() => deleteCard(id)}>
                            <img src={trash} className='w-full h-full p-2.5 object-contain' alt='Deletar'/>
                        </Button>
                    </CardHeader>
                    <Divider />
                    <CardBody className='px-4'>
                        <p className='text-justify'>
                            {quest}
                        </p>
                    </CardBody>
                </Card>

                {/* Verso do Card */}
                <Card
                    className="flip-card-back"
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    classNames={{
                        header: "bg-[#f8f8f8]"
                    }}
                >
                    <CardHeader className="text-[#bb6232] font-medium text-lg">
                        Resposta
                    </CardHeader>
                    <Divider />
                    <CardBody>
                    <p className='text-justify'>
                            {answer}
                        </p>
                    </CardBody>
                </Card>
            </motion.div>
        </motion.div>
    );
};