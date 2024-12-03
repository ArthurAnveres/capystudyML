import React from "react"
import logo from "../../assets/images/CapStudy simbolo.png"

export const Footer = ({ size }) => {

    return (
        <div className="select-none bg-[#e2dbd8] w-full flex justify-center items-end py-4 gap-6" style={{ height: `${size}rem` }}>
            <img src={logo} className="h-full" alt="Logo"/>
            <span className="text-[#bb6232] font-medium">Desenvolvimento - CapyGroup© 2024</span>
        </div>
    )
}
