import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  Grid,
} from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import LoginIcon from "@mui/icons-material/Login";
import LoadingButton from "@mui/lab/LoadingButton";

const getValidationScheme = (isSignIn: boolean) => {
  const commonRules = {
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
  };

  if (isSignIn) {
    return yup.object().shape({ ...commonRules });
  }

  return yup.object().shape({
    ...commonRules,
    confirmPassword: yup
      .string()
      .label("Confirm Password")
      .required()
      .oneOf([yup.ref("password")], "Passwords must match"),
  });
};

interface AuthFormProps {
  isSignIn: boolean;
  onSubmit: (data: FormData) => void;
  disableSubmit: boolean;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSignIn,
  onSubmit,
  disableSubmit,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(getValidationScheme(isSignIn)),
  });

  const submitForm = (data: FormData) => {
    onSubmit(data);
    reset(
      {
        password: "",
        confirmPassword: isSignIn ? undefined : "",
      },
      { keepValues: true }
    );
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} style={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <TextField
            {...register("email")}
            label="Email"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start" sx={{ mr: 0 }}>
                  <AlternateEmailIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="fldPassword" error={!!errors.password}>
              Password
            </InputLabel>
            <OutlinedInput
              id="fldPassword"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              {...register("password")}
              error={!!errors.password}
              autoComplete="off"
              inputProps={{ "data-testid": "password" }}
            />
            {!!errors.password && (
              <FormHelperText error={!!errors.password}>
                {errors.password?.message}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
        {!isSignIn && (
          <Grid item md={12} xs={12}>
            <TextField
              {...register("confirmPassword")}
              label="Confirm Password"
              variant="outlined"
              fullWidth
              type="password"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              margin="normal"
              inputProps={{ "data-testid": "confirmPassword" }}
            />
          </Grid>
        )}
      </Grid>

      <LoadingButton
        color="primary"
        type="submit"
        loading={isSubmitting || disableSubmit}
        loadingPosition="start"
        startIcon={<LoginIcon />}
        variant="contained"
        fullWidth
        sx={{ mt: 3, mb: 2 }}
        data-testid="submitBtn"
      >
        <span>{isSignIn ? "Sign-in" : "Sign-up"}</span>
      </LoadingButton>
    </form>
  );
};

export default AuthForm;
