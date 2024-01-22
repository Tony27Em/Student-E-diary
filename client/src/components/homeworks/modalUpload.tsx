import { FormEvent, FC, useState, useEffect } from "react";
import { Modal } from "@mui/material";
import styles from '../../styles/homeworks.module.scss';
import { FileUploader } from "react-drag-drop-files";

import { FaRegFileArchive } from "react-icons/fa";
import { BsFiletypeTxt } from "react-icons/bs";

interface IModalProps {
  openModal: boolean,
  status: number,
  handleCloseModal: () => void,
  addFile: (file: File) => void,
  uploadFile: (e: FormEvent) => void,
}

type IconType = typeof BsFiletypeTxt;

const fileTypes = ["ZIP", "RAR", 'TXT'];

const formats: { [key: string]: IconType } = {
  'zip': <FaRegFileArchive size={32} />,
  'rar': <FaRegFileArchive size={32} />,
  'txt': <BsFiletypeTxt size={32} />,
}

const dropMessageStyles = {
    width: 496,
    height: 200,
    backgroundColor: '#1976d2',
    opacity: 0.2,
    borderRadius: 10,
  }

const ModalUpload: FC<IModalProps> = ({ openModal, handleCloseModal, uploadFile, addFile, status }) => {
  const [fileName, setFileName] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  const array: string[] = fileName.split('.');
  const ext: string = array[array.length - 1];

  const uploaderDiv =
    <div className={styles.modal_form_uploader}>
      {
        fileName ?
          <div>
            {formats[ext]}
            <p>{fileName}</p>
          </div> :
          <div>
            Чтобы добавить файл, кликните здесь или перетащите файлы. Допускаются файлы форматов: ZIP, RAR, TXT
          </div>
      }
    </div>
 
  const handleChange = (file: File) => {
    addFile(file);
    setFileName(file.name);
    setWarning('');
    setDisabled(false);
  }

  const setInitialStates = () => {
    handleCloseModal();
    setFileName('');
    setWarning('');
    setDisabled(true);
  }

  const closeModal = () => setInitialStates();

  useEffect(() => {
    if(status !== 200) return;
    setInitialStates();
  }, [status])

  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <form
        encType="multipart/form-data"
        onSubmit={uploadFile}
        className={styles.modal_form}
      >
        <FileUploader
          name="file"
          types={fileTypes}
          fileOrFiles='File'
          hoverTitle='.'
          handleChange={(file: File) => handleChange(file)}
          children={uploaderDiv}
          dropMessageStyle={dropMessageStyles}
          onTypeError={() => setWarning('Формат файла не поддерживается')}
        />
        <p className={styles.modal_form_warning}>{warning}</p>
        <button 
          disabled={disabled}
          className={styles.modal_form_button}
          style={{ backgroundColor: disabled ? 'lightgray' : '' }}
        >
          Отправить
        </button>
      </form>
    </Modal>
  )
}

export default ModalUpload;