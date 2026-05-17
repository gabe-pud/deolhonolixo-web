import image2 from "../../assets/svg/image2.svg"
import eyeIcon from "../../assets/svg/eye.svg"
import invisibleIcon from "../../assets/svg/invisible.svg"

import { useState } from "react"

import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../../hooks/useAuth"

export const Register = () => {
  const navigate = useNavigate()

  const { register, loading, error } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [username, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const togglePassword = () => setShowPassword(!showPassword)

  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("As senhas não coincidem")
      return
    }

    try {
      await register(username, email, password, confirmPassword)

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
          <span className="block">Crie</span>
          <span className="block -mt-2">sua conta</span>
        </h1>

        <p className="text-center mt-10 font-semibold text-[17px] text-[#5C5C5C]">
          Digite seus dados para criar sua conta
        </p>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="w-full mt-10 flex flex-col gap-6"
        >

          <div>
            <input
              type="text"
              placeholder="Nome completo"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-[#7083D9] rounded-[14px]"
              required
            />
          </div>

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

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-[#7083D9] rounded-[14px]"
              required
            />

            <img
              src={showConfirmPassword ? invisibleIcon : eyeIcon}
              alt="Mostrar senha"
              onClick={toggleConfirmPassword}
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
            {loading ? "Registrando..." : "Registrar"}
          </button>

        </form>

        {/* Link */}
        <p className="mt-6 text-center font-semibold">
          Já possui uma conta?{" "}

          <Link
            to="/login"
            className="text-[#7083D9] font-semibold hover:underline"
          >
            Faça o login
          </Link>
        </p>

      </section>

      {/* Seção direita */}
      <section className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center lg:flex-1 bg-[#7083D9] min-h-screen">

        <img
          src={image2}
          alt="Ilustração"
          className="w-2xl"
        />

      </section>

    </main>
  )
}