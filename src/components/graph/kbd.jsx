// Small keycap, shared by the graph menu and the on-canvas command bar.
export function Key({ children }) {
    return (
        <kbd className="inline-flex min-w-[1.1rem] items-center justify-center rounded border border-gray-300 border-b-2 bg-white px-1 py-px text-[10px] font-semibold text-gray-700 shadow-sm">
            {children}
        </kbd>
    );
}
