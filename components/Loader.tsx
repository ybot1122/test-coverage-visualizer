export default function () {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={100}
      height={100}
      className="inline"
    >
      <rect
        fill="#755AFF"
        stroke="#755AFF"
        stroke-width="30"
        stroke-linejoin="round"
        width="30"
        height="30"
        x="85"
        y="85"
        rx="0"
        ry="0"
      >
        <animate
          attributeName="rx"
          calcMode="spline"
          dur="2"
          values="15;15;5;15;15"
          keySplines=".5 0 .5 1;.8 0 1 .2;0 .8 .2 1;.5 0 .5 1"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="ry"
          calcMode="spline"
          dur="2"
          values="15;15;10;15;15"
          keySplines=".5 0 .5 1;.8 0 1 .2;0 .8 .2 1;.5 0 .5 1"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="height"
          calcMode="spline"
          dur="2"
          values="30;30;1;30;30"
          keySplines=".5 0 .5 1;.8 0 1 .2;0 .8 .2 1;.5 0 .5 1"
          repeatCount="indefinite"
        ></animate>
        <animate
          attributeName="y"
          calcMode="spline"
          dur="2"
          values="40;170;40;"
          keySplines=".6 0 1 .4;0 .8 .2 1"
          repeatCount="indefinite"
        ></animate>
      </rect>
    </svg>
  );
}
