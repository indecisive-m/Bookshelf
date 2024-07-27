// App.jsx
import Toast, {
  BaseToast,
  ErrorToast,
  ToastProps,
  ToastShowParams,
} from "react-native-toast-message";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

/*
1. Create the config
*/

interface Props extends ToastShowParams {
  backgroundColor: string;
  textColor: string;
}

export const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
    */
  success: (props: Props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props: Props) => <ErrorToast {...props} />,
};
