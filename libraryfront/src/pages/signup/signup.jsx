import styles from "./signup.module.css"
import { Button, Group, TextInput, PasswordInput, Anchor, ActionIcon } from '@mantine/core';
import { IconUserPlus, IconArrowLeft } from '@tabler/icons-react';
import { useForm, isNotEmpty } from '@mantine/form';
import { Link, useNavigate } from "react-router-dom";

export default function Signup(){
    const navigate = useNavigate();
    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: '',
            email: '',
            password: '',
        },

        validate: {
            username: isNotEmpty('Username required'),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: isNotEmpty('Password required'),
        },
    });

    async function handleSignup(values){
        try {
            const res = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(`Signup failed: ${data.error}`);
            }
            if (res.ok) {
                navigate('/signin')
            }
        } catch (err) {
            console.error(err.message);
        }
    }
    return (
        <>
        <div className={styles.parent}>
            <ActionIcon component={Link} to="/" className={styles.back} variant="outline" size="xl" aria-label="Settings">
                <IconArrowLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <form onSubmit={form.onSubmit(handleSignup)} className={styles.form}>
                <div className={styles.head}>
                    <IconUserPlus size={45}/>
                    <h1>Sign up</h1>
                </div>
                <TextInput
                    label="Username"
                    withAsterisk
                    placeholder="user123"
                    {...form.getInputProps('username')}
                />
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />
                <PasswordInput
                    withAsterisk
                    label="Password"
                    placeholder="********"
                    {...form.getInputProps('password')}
                />
                <div className={styles.text}>
                    already have an account? <Anchor component={Link} to="/signin">Sign in</Anchor>
                </div>

                <Group justify="flex-end" mt="md">
                    <Button size="md" type="submit" >Sign up</Button>
                </Group>
            </form>
        </div>
        </>
    )
}