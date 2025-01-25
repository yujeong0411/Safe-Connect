export interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onFindEmail?: () => void;
  onFindPassword?: () => void;
  onSignIn?: () => void;
}
