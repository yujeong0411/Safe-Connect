import styles from './Button.module.scss'

interface ButtonProps {
    variant?: 'primary' | 'secondary';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    children?: React.ReactNode;
    onClick?: () => void;
}

const Button = ({ variant = 'primary', size = 'md', children, onClick }: ButtonProps) => {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]}`}
            onClick={onClick}>
            {children}
            </button>
    )
}

export default Button;