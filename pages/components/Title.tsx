'use client'

interface TitleProps {
    title: string;
}

const Title: React.FC<TitleProps> = ({
    title
}) => {
    return (
        <h1 className="font-bold">{title}</h1>
    )
}

export default Title;