import "./style.css";
export const Operation = ({operation, x, y}) => {
    console.log(operation)
  return (
    <div className="operation" style={{ top: y, left: x }}>
      <span className="name">{operation.operationName}</span>
      <span className="video">
        {operation.video_data && operation.video_data.status
          ? "video"
          : "no video"}
      </span>
      <span className="name">{`${operation.firstName} ${operation.lastName}`}</span>
    </div>
  );
};
