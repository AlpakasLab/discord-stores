export default function SessionError() {
    return (
        <div className="container flex flex-col items-center justify-center gap-y-5 py-20">
            <p className="w-full max-w-lg rounded-md bg-yellow-400 p-3 text-center text-lg font-semibold text-zinc-900">
                Estamos com problemas para conectar sua conta do Discord, tente
                novamente mais tarde!
            </p>
            <p className="text-sm text-zinc-400">
                Se o problema persistir procure um administrador do site.
            </p>
        </div>
    )
}
