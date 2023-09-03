export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex w-full flex-grow flex-col">
            <header className="w-full border-b border-zinc-700">
                <div className="container h-14"></div>
            </header>
            {children}
        </div>
    )
}
