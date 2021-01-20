/// <reference types="react" />
import { UserHandlerArgs } from './LoginForm';
declare type SignupFormProps = {
    handle_signup: ({ e, email, password }: UserHandlerArgs) => void;
    errorMessage: string | null;
};
export default function SignupForm({ handle_signup, errorMessage }: SignupFormProps): JSX.Element;
export {};
