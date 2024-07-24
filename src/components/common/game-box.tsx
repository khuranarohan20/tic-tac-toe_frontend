import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CardContent {
  player1: string;
  player2: string;
  winner: string;
  status: "Completed" | "In Progress";
}

const GameBox = (props: CardContent) => {
  return (
    <Card className="m-5 p-2 relative">
      <CardHeader>
        <CardTitle>
          {props.winner}
          <span className="absolute top-[18px] left-[15px] rotate-[-45deg]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              className="h-[20px] w-[20px]"
            >
              <path d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z" />
            </svg>
          </span>
        </CardTitle>
        <CardDescription>{props.status}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <p>{props.player1}</p> | <p>{props.player2}</p>
      </CardContent>
    </Card>
  );
};

export default GameBox;
