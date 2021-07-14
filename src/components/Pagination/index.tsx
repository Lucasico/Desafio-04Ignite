/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/button-has-type */
import styledGlobal from "../../styles/common.module.scss";
import styledLocal from "./pagination.module.scss";

type PropsPagination = {
  handlePagination: () => void;
};

export default function Pagination({ handlePagination }: PropsPagination) {
  return (
    <div className={styledGlobal.container}>
      <button
        style={{ background: "none", border: 0 }}
        onClick={handlePagination}
      >
        <span className={styledLocal.paginationItem}>Carregar mais posts</span>
      </button>
    </div>
  );
}
