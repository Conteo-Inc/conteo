/// <reference types="react" />
import { UserHandlerArgs } from './LoginForm';
declare type SignupFormProps = {
    handle_signup: ({ e, username, password }: UserHandlerArgs) => void;
};
export default function SignupForm({ handle_signup }: SignupFormProps): JSX.Element;
export {};
