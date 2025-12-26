import styles from "./signin.module.css"
import { Button, Group, TextInput, PasswordInput, Anchor, ActionIcon } from '@mantine/core';
import { IconLogin2, IconArrowLeft } from '@tabler/icons-react';
import { isNotEmpty, useForm } from '@mantine/form';

export default function Signin(){
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
    return (
        <>
        <div className={styles.parent}>
            <ActionIcon component="a" href="/" className={styles.back} variant="outline" size="xl" aria-label="Settings">
                <IconArrowLeft style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <form onSubmit={form.onSubmit((values) => console.log(values))} className={styles.form}>
                <div className={styles.head}>
                    <IconLogin2 size={45}/>
                    <h1>Sign in</h1>
                </div>
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
                    don't have an account? <Anchor href="/signup">Sign up</Anchor>
                </div>

                <Group justify="flex-end" mt="md">
                    <Button size="md" type="submit">Sign in</Button>
                </Group>
            </form>
        </div>
        </>
    )
}