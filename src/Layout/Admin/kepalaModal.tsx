import { MinusOutlined } from "@ant-design/icons";

export default function KepalaModal({ status }: { status: number }) {
  return (
    <div className="flex justify-around items-center">
      <p
        className={`${status == 0 ? "bg-cyan" : ""} rounded-full p-1
                }`}
      >
        1
      </p>
      <p>
        <MinusOutlined />
      </p>
      <p className={`${status == 1 ? "bg-cyan" : ""} rounded-full p-1`}>2</p>
      <p>
        <MinusOutlined />
      </p>

      <p className={`${status == 2 ? "bg-cyan" : ""} rounded-full p-1`}>3</p>
    </div>
  );
}
