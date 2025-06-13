import react from 'react'
import BookCover from '../BookCover';
import styles from './BlurredBackground.module.css';

const BlurredBackground = ({ cover, children }) => {
    return (
        <div className={styles['blurred-background']}>
            <div className={styles['blurred-background__image-wrapper']}>
                <BookCover cover={cover} className={styles['blurred-background__image']} />
            </div>
            <div className={styles['blurred-background__overlay']} />
            <div className={styles['blurred-background__content']}>
                {children}
            </div>
        </div>
    )
}


export default BlurredBackground;