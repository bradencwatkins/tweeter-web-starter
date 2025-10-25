import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Buffer } from "buffer";
import { View } from "./Presenter";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export interface RegisterView extends View {
  updateUserInfo(
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
  navigate(url: string): void;
  setImageUrl(value: string): void;
  setImageBytes(value: Uint8Array): void;
  setImageFileExtension(value: string): void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  private service: UserService;

  constructor(view: RegisterView) {
    super(view);
    this.service = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    await this.doAuthenticationOperation(
      () =>
        this.service.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        ),
      rememberMe,
      "register user"
    );
  }

  public handleImageFile = (file: File | undefined) => {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };

  public getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };

  public checkSubmitButtonStatus = (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean => {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };
}
