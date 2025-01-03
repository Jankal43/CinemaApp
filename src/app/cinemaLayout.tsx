import {MdEventSeat} from "react-icons/md";

interface Seat {
    seat: string,
    status: string
}
interface RoomInfo {
    id: string;
    movieId: string;
    roomId: string;
    dateTime: string;
    seats: Seat[];
}

const roomInfo: RoomInfo = {
    id: "screening1",
    movieId: "movie123",
    roomId: "room1",
    dateTime: "2025-01-05T18:00:00Z",
    seats: [
        { seat: "A1", status: "available" },
        { seat: "A2", status: "available" },
        { seat: "A3", status: "reserved" },
        { seat: "A4", status: "available" },
        { seat: "A5", status: "available" },
        { seat: "A6", status: "reserved" },
        { seat: "A7", status: "available" },
        { seat: "A8", status: "available" },
        { seat: "A9", status: "reserved" },
        { seat: "A10", status: "available" },
        { seat: "A11", status: "available" },
        { seat: "A12", status: "reserved" },
        { seat: "B1", status: "available" },
        { seat: "B2", status: "available" },
        { seat: "B3", status: "reserved" },
        { seat: "B4", status: "available" },
        { seat: "B5", status: "available" },
        { seat: "B6", status: "reserved" },
        { seat: "B7", status: "available" },
        { seat: "B8", status: "available" },
        { seat: "B9", status: "reserved" },
        { seat: "B10", status: "available" },
        { seat: "B11", status: "available" },
        { seat: "B12", status: "reserved" },
        { seat: "C1", status: "available" },
        { seat: "C2", status: "available" },
        { seat: "C3", status: "reserved" },
        { seat: "C4", status: "available" },
        { seat: "C5", status: "available" },
        { seat: "C6", status: "reserved" },
        { seat: "C7", status: "available" },
        { seat: "C8", status: "available" },
        { seat: "C9", status: "reserved" },
        { seat: "C10", status: "available" },
        { seat: "C11", status: "available" },
        { seat: "C12", status: "reserved" },
        { seat: "D1", status: "available" },
        { seat: "D2", status: "available" },
        { seat: "D3", status: "reserved" },
        { seat: "D4", status: "available" },
        { seat: "D5", status: "available" },
        { seat: "D6", status: "reserved" },
        { seat: "D7", status: "available" },
        { seat: "D8", status: "available" },
        { seat: "D9", status: "reserved" },
        { seat: "D10", status: "available" },
        { seat: "D11", status: "available" },
        { seat: "D12", status: "reserved" },
        { seat: "E1", status: "available" },
        { seat: "E2", status: "available" },
        { seat: "E3", status: "reserved" },
        { seat: "E4", status: "available" },
        { seat: "E5", status: "available" },
        { seat: "E6", status: "reserved" },
        { seat: "E7", status: "available" },
        { seat: "E8", status: "available" },
        { seat: "E9", status: "reserved" },
        { seat: "E10", status: "available" },
        { seat: "E11", status: "available" },
        { seat: "E12", status: "reserved" },
        { seat: "F1", status: "available" },
        { seat: "F2", status: "available" },
        { seat: "F3", status: "reserved" },
        { seat: "F4", status: "available" },
        { seat: "F5", status: "available" },
        { seat: "F6", status: "reserved" },
        { seat: "F7", status: "available" },
        { seat: "F8", status: "available" },
        { seat: "F9", status: "reserved" },
        { seat: "F10", status: "available" },
        { seat: "F11", status: "available" },
        { seat: "F12", status: "reserved" },
    ],
};



export default function CinemaLayout() {

    function divideSeats(seats: Seat[]): Record<string, string[]> {
        const newSeats: Record<string, string[]> = {};
        seats.forEach((seat) => {
            const seatLetter = seat.seat[0];
            if (seatLetter in newSeats) {
                newSeats[seatLetter].push(seat.status);
            } else {
                newSeats[seatLetter] = [seat.status];
            }
        });
        return newSeats;
    }




    const seats: Record<string, string[]> = divideSeats(roomInfo.seats)


    return (
        <div className="w-full min-h-dvh flex flex-col items-center justify-center text-gray-100">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
                Cinema Layout
            </h2>

            <div className="space-y-8 p-12 rounded-xl shadow-2xl max-w-4xl w-full mx-4">
                {/* Screen */}
                <div className="mb-16">
                    <svg width="100%" viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 20 Q100 0, 200 20"
                            stroke="#FF033E"
                            fill="none"
                            strokeWidth="2"
                            className="drop-shadow-[0_0_8px_rgba(255,3,62,0.7)]"
                        />
                        <text
                            x="100"
                            y="25"
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="font-mono text-xs tracking-[0.3em] font-bold"
                        >
                            SCREEN
                        </text>
                    </svg>
                </div>

                <div className="flex justify-center gap-6 mb-8 text-sm">
                    <div className="flex items-center gap-2">
                        <MdEventSeat className="text-red-500 text-2xl"/>
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdEventSeat className="text-blue-500 text-2xl"/>
                        <span>Reserved</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    {Object.entries(seats).map(([row, seatRow]) => (
                        <div key={row} className="flex gap-4 items-center">
                            <span className="text-gray-400 font-mono w-6 text-right">{row}</span>
                            {seatRow.map((seat, index) => (
                                <button
                                    key={`${row}-${index}`}
                                    disabled={seat === "reserved"}
                                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-sm"
                                >
                                    <MdEventSeat
                                        className={`text-2xl ${
                                            seat === "reserved"
                                                ? "text-blue-500 opacity-50"
                                                : "text-red-500 cursor-pointer"
                                        }`}
                                    />
                                </button>

                            ))}
                            <span className="text-gray-400 font-mono w-6 text-right">{row}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>)
}