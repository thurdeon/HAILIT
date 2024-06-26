export default function Container ({children, className}: {children: React.ReactNode, className: string}) {
    return (
        <div className={`${className} border border-slate-300 bg-white hover:bg-gray-50 dark:border-slate-100 dark:border-opacity-20 dark:bg-[#1e1e1e] dark:hover:border-slate-100 dark:text-slate-100  cursor-pointer `}>
            {children}
        </div>
    )
}