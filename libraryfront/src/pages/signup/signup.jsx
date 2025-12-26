import styles from "./signup.module.css"
import { Button, Group, TextInput, PasswordInput, Anchor, ActionIcon } from '@mantine/core';
import { IconUserPlus, IconArrowLeft } from '@tabler/icons-react';
import { useForm, isNotEmpty } from '@mantine/form';

export default function Signup(){
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
    return (
        <>
        <div className={styles.parent}>
            <ActionIcon component="a" href="/" className={styles.back} variant="outline" size="xl" aria-label="Settings">
                <IconArrowLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <form onSubmit={form.onSubmit((values) => console.log(values))} className={styles.form}>
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
                    already have an account? <Anchor href="/signin">Sign in</Anchor>
                </div>

                <Group justify="flex-end" mt="md">
                    <Button size="md" type="submit">Sign up</Button>
                </Group>
            </form>
        </div>
        </>
    )
}