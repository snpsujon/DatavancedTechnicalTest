export interface GridColumn<T> {
  caption: string; // Column header
  key: keyof T; // Key to map to object property
  width?: number; // Optional width
  isShow?: boolean; // Whether to show this column
  type?: any; // Optional type for formatting
  isReadOnly?:boolean
}

export interface GridButtonAction<T> {
  isShow?: boolean; // Whether to show the button
  emit?: (selectedRecord: T) => void; // Function to call dynamically
}

export interface GridButtonShow<T> {
  edit?: GridButtonAction<T>;
  delete?: GridButtonAction<T>;
  viewDetails?: GridButtonAction<T>;
  print?: GridButtonAction<T>;
  pen?:GridButtonAction<T>;
}

export class DefaultGridButtonShow<T> implements GridButtonShow<T> {
  edit = { isShow: false, emit: undefined }; // Default for edit
  delete = { isShow: false, emit: undefined }; // Default for delete
  viewDetails = { isShow: false, emit: undefined }; // Default for view details
  print = { isShow: false, emit: undefined }; // Default for print
  pen = { isShow: false, emit: undefined }; // Default for print
}
