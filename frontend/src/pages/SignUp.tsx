import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '../api/api'; // Import the API function
import '../styles.css';
import { Input } from '@/components/ui/input';
import { signUpSchema } from '@/schemas/schemas';

interface SignUpProps {
  onRegisterSuccess: (user: { email: string; password: string }) => void;
}

type FormFields = z.infer<typeof signUpSchema>;

const SignUp: React.FC<SignUpProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({
    resolver: zodResolver(signUpSchema),
  });

  const mutation = useMutation({
    mutationFn: (user: { email: string; password: string }) => signUp(user.email, user.password),
    onSuccess: () => {
      onRegisterSuccess({ email: ("email"), password: ("password") });
      alert('Sign up successful');
      navigate('/login');
    },
    onError: (error: any) => {
      setError("root", { message: error.message || 'Failed to register' });
    },
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    mutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Email:</label>
          <Input
            placeholder="E-mail"
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
        <br />
        <div>
          <label>Confirm Password:</label>
          <Input
            placeholder="Re-enter Password"
            type="password"
            {...register("confirmPassword")}
            required
          />
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
        </div>
        {errors.root && <p style={{ color: 'red' }}>{errors.root.message}</p>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
