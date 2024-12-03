import React from 'react'
import { Navbar } from '../../components/navbar'

// Imagens
import logo from '../../assets/images/CapStudy horizontal.png'
import memo from '../../assets/images/memo1.jpg'
import card from '../../assets/images/card.png'
import pomodoro from '../../assets/images/pomodoro.png'
import { Footer } from '../../components/footer'
import { Button } from '@nextui-org/button'
import { Link } from '@nextui-org/link'

export const Homepage = () => {
  return (
    <>
      <Navbar />
      {/* Início */}
      <div className='w-full flex justify-center max-md:flex-col max-md:gap-6 items-center md:mt-8 py-6 px-8'>
        <div className="container flex justify-center items-center">
          <div className='flex flex-col gap-6'>
            <img src={logo} width={250} alt='Logo'/>
            <div>
              <h1 className='text-[#bb6232] text-[40px] font-medium'>Desbloqueie seu potencial de estudo.</h1>
              <h5 className='text-[#212529bf] font-medium text-base'>Descubra técnicas e ferramentas de estudo poderosas para aumentar sua produtividade e se sair bem nos exames.</h5>
            </div>
            <div className='flex gap-6'>
              <Button href="#flash" as={Link} radius='sm' className='bg-[#bb6232] text-[#e2dbd8]'>Flash Card</Button>
              <Button href="#pomodoro" as={Link} radius='sm' className='bg-[#bb6232] text-[#e2dbd8]'>Pomodoro</Button>
            </div>
          </div>
        </div>
        <div className="container flex justify-center items-center">
          <img src={memo} className='rounded-md' alt='Memo'/>
        </div>
      </div>
      {/* Flash cards */}
      <div id="flash"></div>
      <div className='w-full flex flex-row-reverse max-md:flex-col max-md:gap-6 justify-center items-center md:mt-16 py-6 px-8'>
        <div className="container flex justify-center items-center">
          <div className='flex flex-col gap-6'>
            <div>
              <h1 className='text-[#bb6232] text-[40px] font-medium'>Desbloqueie seu potencial de estudo.</h1>
              <h5 className='text-[#212529bf] font-medium text-base'>Descubra técnicas e ferramentas de estudo poderosas para aumentar sua produtividade e se sair bem nos exames.</h5>
            </div>
            <div className='flex gap-6'>
              <Button href='/flash' as={Link} radius='sm' className='bg-[#bb6232] text-[#e2dbd8]'>Comece já</Button>
              <Button isExternal showAnchorIcon href='https://kultivi.com/blog/geral/flashcards-saiba-o-que-sao-e-como-usar' as={Link} radius='sm' className='bg-[#bb6232] text-[#e2dbd8]'>Saiba mais</Button>
            </div>
          </div>
        </div>
        <div className="container flex justify-center items-center">
          <img src={card} className='rounded-md' alt='Cards'/>
        </div>
      </div>
      {/* Pomodoro */}
      <div id="pomodoro"></div>
      <div className='w-full flex justify-center max-md:flex-col max-md:gap-6 items-center md:mt-16 py-6 px-8'>
        <div className="container flex justify-center items-center">
          <div className='flex flex-col gap-6'>
            <div>
              <h1 className='text-[#bb6232] text-[40px] font-medium'>Desbloqueie seu potencial de estudo.</h1>
              <h5 className='text-[#212529bf] font-medium text-base'>Descubra técnicas e ferramentas de estudo poderosas para aumentar sua produtividade e se sair bem nos exames.</h5>
            </div>
            <div className='flex gap-6'>
              <Button href='/pomodoro' as={Link} radius='sm' className='bg-[#bb6232] text-[#e2dbd8]'>Comece já</Button>
              <Button isExternal showAnchorIcon href='https://brasilescola.uol.com.br/dicas-de-estudo/tecnica-pomodoro-que-e-e-como-funciona.htm' as={Link} radius='sm' className='bg-[#bb6232] text-[#e2dbd8]'>Saiba mais</Button>
            </div>
          </div>
        </div>
        <div className="container flex justify-center items-center">
          <img src={pomodoro} className='rounded-md' alt='Pomodoro'/>
        </div>
      </div>
      <Footer size={8} />
    </>
  )
}