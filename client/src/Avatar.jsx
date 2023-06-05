// eslint-disable-next-line react/prop-types
export default function Avatar({userId,username}) {
    const colors =['bg-red-300','bg-zinc-400'
                    ,'bg-slate-200','bg-orange-200',
                    'bg-amber-200','bg-yellow-200',
                    'bg-lime-200','bg-green-200',
                    'bg-emerald-300','bg-teal-300',
                    'bg-cyan-300','bg-sky-300',
                    'bg-blue-200','bg-indigo-300',
                    'bg-violet-300','bg-purple-200',
                    'bg-fuchsia-200','bg-pink-200',
                    'bg-rose-300']
    const userIdbase10 = parseInt(userId, 16);
    const colorIndex = ((userIdbase10+1)%colors.length);
    const color =colors[colorIndex];
    return (
        <div className={"w-8 h-8 rounded-full flex items-center "+color}>
            <span className="text-center w-full opacity-70">{username[0]}</span>
        </div>
    );
}