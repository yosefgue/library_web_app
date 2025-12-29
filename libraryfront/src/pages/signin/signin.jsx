import styles from "./signin.module.css"
import { Button, Group, TextInput, PasswordInput, Anchor, ActionIcon } from '@mantine/core';
import { IconLogin2, IconArrowLeft } from '@tabler/icons-react';
import { isNotEmpty, useForm } from '@mantine/form';
import { Link, useNavigate } from "react-router-dom";


export default function Signin(){
    const navigate = useNavigate()
    const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: isNotEmpty('Password required'),
    },
    });

    async function handleSignin(values){
        try {
            const res = await fetch("http://localhost:8000/api/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(`Login failed: ${data.error}`);
            }
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("token", data.token);
                navigate("/dashboard")
            }

        } catch(err) {
            console.error(err.message);
        }
    }

    return (
        <div className={styles.parent}>
            <ActionIcon component={Link} to="/" className={styles.back} variant="outline" size="xl" aria-label="Settings">
                <IconArrowLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <form onSubmit={form.onSubmit(handleSignin)} className={styles.form}>
                <div className={styles.head}>
                    <IconLogin2 size={45}/>
                    <h1>Sign in</h1>
                </div>
                <TextInput
                    withAsterisk
                    label="email"
                    placeholder="your@email.com"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />
                <PasswordInput
                    withAsterisk
                    label="password"
                    placeholder="********"
                    {...form.getInputProps('password')}
                />
                <div className={styles.text}>
                    don't have an account? <Anchor component={Link} to="/signup">Sign up</Anchor>
                </div>

                <Group justify="flex-end" mt="md">
                    <Button size="md" type="submit">Sign in</Button>
                </Group>
            </form>
        </div>
    )
}