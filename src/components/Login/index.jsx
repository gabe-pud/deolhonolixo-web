import image1 from "../../assets/svg/image1.svg"
import eyeIcon from "../../assets/svg/eye.svg"
import invisibleIcon from "../../assets/svg/invisible.svg"
import { useState } from "react"
import { Link } from "react-router-dom"

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <main className="flex flex-row lg:min-h-screen items-center justify-center">
      {/* Seção esquerda */}
      <section className="w-full max-w-[600px] px-6 flex flex-col items-center min-h-screen overflow-y-scroll max-h-screen justify-center no-scrollbar custom-scrollbar">
        <h1 className="text-7xl lg:text-8xl font-bold text-center leading-[0.8]">
          <span className="block">Entre na</span>
          <span className="block -mt-2">sua conta</span>
        </h1>
        <p className="text-center mt-10 font-semibold text-[17px] text-[#5C5C5C]">
          Digite seu e-mail e senha para fazer login
        </p>

        {/* Formulário de login */}
        <form className="w-full mt-10 flex flex-col gap-6">
          <div>
            <input
              type="email"
              placeholder="E-mail"
              className="w-full p-3 border border-[#7083D9] rounded-[14px] hover:border-[#7083D9]"
              required
            />
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              className="w-full p-3 border border-[#7083D9] rounded-[14px]"
              required
            />
            <img
              id="btn-password"
              src={showPassword ? invisibleIcon : eyeIcon}
              alt="Mostrar senha"
              onClick={togglePassword}
              className="absolute right-3 top-3 w-6 h-6 cursor-pointer"
            />
          </div>
          <button
            type="submit"
            className="bg-[#7083D9] text-white py-3 rounded-[14px] font-semibold hover:bg-[#5463a5] cursor-pointer"
          >
            Entrar
          </button>
        </form>

        {/* Link para registro */}
        <p className="mt-6 text-center font-semibold">
          Ainda não tem uma conta?{" "}
          <Link to="/register" className="text-[#7083D9] font-semibold hover:underline">
            Faça o registro
          </Link>
        </p>
      </section>

      {/* Seção direita */}
      <section className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:flex-1 bg-[#7083D9] min-h-screen">
        <img src={image1} alt="Ilustração" className="w-2xl" />

      </section>
    </main>
  )
}
