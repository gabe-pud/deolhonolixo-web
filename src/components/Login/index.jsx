import image1 from "../../assets/svg/image1.svg"
import eyeIcon from "../../assets/svg/eye.svg"
import invisibleIcon from "../../assets/svg/invisible.svg"

import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../../hooks/useAuth"

export const Login = () => {
  const navigate = useNavigate()

  const { login, loading, error } = useAuth()

  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await login(email, password)

      navigate("/admin")
    } catch (err) {
      console.error(err)
    }
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

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="w-full mt-10 flex flex-col gap-6"
        >

          <div>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#7083D9] rounded-[14px]"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#7083D9] rounded-[14px]"
              required
            />

            <img
              src={showPassword ? invisibleIcon : eyeIcon}
              alt="Mostrar senha"
              onClick={togglePassword}
              className="absolute right-3 top-3 w-6 h-6 cursor-pointer"
            />
          </div>

          {error && (
            <p className="text-red-500 font-semibold text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#7083D9] text-white py-3 rounded-[14px] font-semibold hover:bg-[#5463a5] cursor-pointer disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>

        {/* Link */}
        {/* <p className="mt-6 text-center font-semibold">
          Ainda não tem uma conta?{" "}

          <Link
            to="/register"
            className="text-[#7083D9] font-semibold hover:underline"
          >
            Faça o registro
          </Link>
        </p> */}

      </section>

      {/* Seção direita */}
      <section className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:flex-1 bg-[#7083D9] min-h-screen">

        <img
          src={image1}
          alt="Ilustração"
          className="w-2xl"
        />

      </section>

    </main>
  )
}