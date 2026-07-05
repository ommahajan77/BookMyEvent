import React from "react";

// Generates seat labels e.g. A1, A2 ... based on rows and seatsPerRow
const generateSeatLayout = (totalSeats) => {
  const seatsPerRow = 8;
  const rows = Math.ceil(totalSeats / seatsPerRow);
  const layout = [];
  let seatCount = 0;

  for (let r = 0; r < rows; r++) {
    const rowLabel = String.fromCharCode(65 + r);
    const row = [];
    for (let s = 1; s <= seatsPerRow && seatCount < totalSeats; s++) {
      row.push(`${rowLabel}${s}`);
      seatCount++;
    }
    layout.push(row);
  }
  return layout;
};

const SeatPicker = ({ totalSeats, bookedSeats = [], selectedSeats, setSelectedSeats, maxSeats = 6 }) => {
  const layout = generateSeatLayout(totalSeats);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      if (selectedSeats.length >= maxSeats) return;
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const seatClass = (seat) => {
    if (bookedSeats.includes(seat)) return "bg-red-400 text-white cursor-not-allowed";
    if (selectedSeats.includes(seat)) return "bg-blue-500 text-white";
    return "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
  };

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="w-3/4 h-2 bg-gray-300 rounded-full"></div>
      </div>
      <p className="text-center text-xs text-gray-400 mb-6">STAGE / SCREEN</p>

      <div className="flex flex-col items-center gap-2 mb-6">
        {layout.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((seat) => (
              <button
                key={seat}
                type="button"
                onClick={() => toggleSeat(seat)}
                disabled={bookedSeats.includes(seat)}
                className={`w-9 h-9 rounded text-xs font-semibold flex items-center justify-center transition-colors ${seatClass(seat)}`}
              >
                {seat}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-100 border border-green-300"></span> Available</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-red-400"></span> Booked</div>
        <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-blue-500"></span> Selected</div>
      </div>
    </div>
  );
};

export default SeatPicker;
