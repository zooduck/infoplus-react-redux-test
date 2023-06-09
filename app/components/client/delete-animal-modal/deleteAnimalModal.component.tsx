import { Modal } from "../modal/modal.component";
import { useEffect, useState } from "react";
import { animalsSlice } from "@/app/animalsSlice";
import { useDispatch, useSelector } from 'react-redux';
import { getTotalNumberOfAnimalsInDatabase, deleteAnimalFromDatabase } from "@/app/firebase";
import componentStyles from './deleteAnimalModal.module.css';
import globalStyles from '../../../globals.module.css';

const styles = {
  ...globalStyles,
  ...componentStyles
};

const {
  removeAnimalFromBasket,
  setSelectedAnimal,
  setDeleteAnimalModalData,
  updateDeletedAnimals,
  setTotalNumberOfAnimalsInDatabase
} = animalsSlice.actions;

export function DeleteAnimalModal() {
  const { deleteAnimalModalData } = useSelector((state: { deleteAnimalModalData: any }) => {
    return state;
  });

  const { id, name, docID } = deleteAnimalModalData;

  const dispatch = useDispatch();

  const { animals, selectedAnimal } = useSelector((state: { animals: AnimalData[][]; selectedAnimal: string; }) => {
    return state;
  });

  useEffect(() => {
    setShowDeleteAnimalModal(!!deleteAnimalModalData.id);
  }, [deleteAnimalModalData]);

  const [showDeleteAnimalModal, setShowDeleteAnimalModal] = useState(false);
  const [deleteDocError, setDeleteDocError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  return (
    <>
    <Modal isOpen={showDeleteAnimalModal}>
      <section className={styles["delete-animal-modal"]}>
        <p>Are you sure you want to delete &quot;{name}&quot; from the database?</p>
        <section className={styles["delete-animal-modal__buttons"]}>
          <button
            autoFocus={true}
            className={[styles["button"], styles["button--primary"]].join(' ')}
            onClick={async () => {
              try {
                await deleteAnimalFromDatabase(docID);
              } catch (error: any) {
                setDeleteDocError(error.toString());
                setShowDeleteAnimalModal(false);
                setShowErrorModal(true);
                return;
              }

              dispatch(removeAnimalFromBasket({ id: id, removeAllInstances: true }));

              if (id === selectedAnimal) {
                dispatch(setSelectedAnimal({ id: animals[0][0].id }));
              }

              dispatch(setDeleteAnimalModalData({ id: '', name: '', docID: '' }));
              dispatch(updateDeletedAnimals({ id: id }));

              const totalNumberOfAnimalsInDatabase = await getTotalNumberOfAnimalsInDatabase();
              dispatch(setTotalNumberOfAnimalsInDatabase(totalNumberOfAnimalsInDatabase));
          }} onKeyDown={(event) => {
            const { key, shiftKey } = event;
            if (key === 'Tab' && shiftKey) {
              event.preventDefault();
            }
          }}>Confirm</button>
          <button className={[styles["button"], styles["button--secondary"]].join(' ')} onClick={() => {
            dispatch(setDeleteAnimalModalData({ id: '', name: '', docID: '' }));
          }} onKeyDown={(event) => {
            const { key, shiftKey } = event;
            if (key === 'Tab' && !shiftKey) {
              event.preventDefault();
            }
          }}>Cancel</button>
        </section>
      </section>
    </Modal>
    <Modal isOpen={!showDeleteAnimalModal && showErrorModal}>
      <section className={styles["alert-modal"]}>
        <header className={styles["alert-modal__header"]}>
          <span>&#x1F62C;</span>
          <h1 className={styles["alert-modal__heading"]}>YOU MUST BE LOGGED IN TO DELETE ANIMALS</h1>
          <span>&#x1F62C;</span>
        </header>
        <p className={styles["alert-modal__error"]}>{deleteDocError}</p>
        <button
          autoFocus={true}
          className={[styles["button"], styles["button--primary"], styles["alert-modal__button"]].join(' ')}
          onClick={() => {
            setShowErrorModal(false);
          }}>OK</button>
      </section>
    </Modal>
    </>
  )
}
