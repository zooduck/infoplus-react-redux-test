import { getAnimalsFromDBWithPagination } from "@/app/firebase";
import { useDispatch, useSelector } from "react-redux";
import { animalsSlice } from "@/app/animalsSlice";
import componentStyles from './paginationControls.module.css';
import globalStyles from '../../../globals.module.css';

const styles = {
  ...globalStyles,
  ...componentStyles
};

const { addAnimals, setCurrentAnimals } = animalsSlice.actions;

export function PaginationControls() {
  const dispatch = useDispatch();
  const { animals: animalsFromStore, currentPage, totalNumberOfAnimalsInDatabase } = useSelector((state: { animals: AnimalData[][]; currentPage: number; totalNumberOfAnimalsInDatabase: number; }) => {
    return state;
  });

  const pages = Math.ceil(totalNumberOfAnimalsInDatabase / 4);

  return (
    <section className={styles["pagination-controls"]}>
      <button className={[styles["button"], styles["button--secondary"]].join(' ')} onClick={async () => {
        const previousPage = currentPage -1;
        if (previousPage < 0) {
          return;
        }
        dispatch(setCurrentAnimals({ page: previousPage }));
      }}>Last</button>
      <span>Page {currentPage + 1} of {pages}</span>
      <button className={[styles["button"], styles["button--secondary"]].join(' ')} onClick={async () => {
        const nextPage = currentPage + 1;

        if (animalsFromStore[nextPage]) {
          dispatch(setCurrentAnimals({ page: nextPage }));
          return;
        }

        const animals:AnimalData[] = await getAnimalsFromDBWithPagination();

        if (!animals.length) {
          return;
        }

        dispatch(addAnimals({ animals: animals }));
        dispatch(setCurrentAnimals({ page: nextPage }));
      }}>Next</button>
    </section>
  )
}
