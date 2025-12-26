import styles from "./signin.module.css"
import { Button, Group, TextInput, PasswordInput, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';

export default function Signin(){
    const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });
    return (
        <>
        <div className={styles.parent}>
            <h1>Sign In</h1>
            <form onSubmit={form.onSubmit((values) => console.log(values))} className={styles.form}>
                <TextInput
                    withAsterisk
                    label="Email"
                    placeholder="your@email.com"
                    key={form.key('email')}
                    {...form.getInputProps('email')}
                />
                <PasswordInput
                    label="Password"
                    placeholder="********"
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