import styledGlobal from "../../styles/common.module.scss";
import styledLocal from "./pagination.module.scss";

type PropsPagination = {
  handlePagination: () => void;
};

export default function Pagination({
  handlePagination,
}: PropsPagination): JSX.Element {
  return (
    <div className={styledGlobal.container}>
      <button
        type="button"
        style={{ background: "none", border: 0 }}
        onClick={handlePagination}
      >
        <span className={styledLocal.paginationItem}>Carregar mais posts</span>
      </button>
    </div>
  );
}
