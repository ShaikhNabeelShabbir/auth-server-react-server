import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from '../api/api'; // Import the API function
import '../styles.css';
import { Input } from '@/components/ui/input';
import { logInSchema } from '@/schemas/schemas';

interface LoginProps {
  onLoginSuccess: (email: string, token: string) => void;
}

type FormFields = z.infer<typeof logInSchema>;

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({
    resolver: zodResolver(logInSchema),
  });

  const mutation = useMutation({
    mutationFn: (user: { email: string; password: string }) => signIn(user.email, user.password),
    onSuccess: (data) => {
      onLoginSuccess(data.email, data.token);
      alert('Login successful');
      navigate('/');
    },
    onError: (error: any) => {
      setError("root", { message: error.message || 'Failed to login' });
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    mutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <Input
            placeholder="Email"
            type="email"
            {...register("email")}
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </div>
        <br />
        <div>
          <label>Password:</label>
          <Input
            placeholder="Password"
            type="password"
            {...register("password")}
            required
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>
        {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
