import styles from "./plan.module.css";
import { Badge, Button, ActionIcon } from '@mantine/core';
import { IconCheck, IconArrowLeft } from '@tabler/icons-react';
import { Link } from "react-router-dom";

export default function Plan() {
    return(
        <div className={styles.parent}>
            <ActionIcon component={Link} to="/" className={styles.back} variant="outline" size="xl" aria-label="Settings">
                <IconArrowLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <div className={styles.container}>
                <div className={styles.head}>
                    <h1>Pricing plans</h1>
                    <p>choose the right plan for your needs</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.price}>
                        <Badge color="blue">Free</Badge>
                        <h1>$0/month</h1>
                    </div>
                    <div className={styles.content}>
                        <div>
                            <IconCheck size={22}/>
                            <p><b>Limited</b> access to the library</p>
                        </div>
                        <div>
                            <IconCheck size={22}/>
                            <p>Borrow up to <b>2</b> books at a time</p>
                        </div>
                    </div>
                    <Button>Choose plan</Button>
                </div>
            </div>
            <div className={styles.card}>
                <div className={`${styles.price} ${styles.premium}`}>
                    <Badge color="blue">Premium</Badge>
                    <h1>$9/month</h1>
                </div>
                <div className={styles.content}>
                    <div>
                        <IconCheck size={22}/>
                        <p><b>Unlimited</b> access to the library</p>
                    </div>
                    <div>
                        <IconCheck size={22}/>
                        <p>Borrow up to <b>10</b> books at a time</p>
                    </div>
                </div>
                <Button>Choose plan</Button>
            </div>
        </div>
    )
}