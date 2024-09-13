import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail = emailList.map(function (item) { return item.A })
      console.log(totalemail)
      setEmailList(totalemail)

    }

    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true)
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email Sent Successfully")
          setstatus(false)
        }
        else {
          alert("Failed")
          setstatus(false)
        }
      })
  }

  return (
    <div>
      <div className="bg-blue-900 text-white text-center py-6 shadow-lg fade-in">
        <h1 className="text-4xl font-bold tracking-wide">BulkMail</h1>
        <p className="mt-2 text-lg">Effortlessly manage and send bulk emails with a simple interface</p>
      </div>

      <div className="bg-blue-800 text-white text-center py-6 fade-in">
        <h2 className="text-2xl font-medium">Automate Your Email Marketing</h2>
        <p className="mt-2 px-8">BulkMail helps you streamline your email campaigns by sending multiple emails with just a click. Drag and drop your content, select your contacts, and start sending—quick and easy!</p>
      </div>

      <div className="bg-blue-600 flex flex-col items-center text-white px-6 py-10 fade-in">
        <textarea
          onChange={handlemsg}
          value={msg}
          className="w-[80%] h-32 py-3 px-4 border border-gray-500 rounded-md outline-none bg-blue-700 text-white placeholder-gray-400 focus:placeholder-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition duration-200 shadow-sm"
          placeholder="Compose your email message here..."
        />
        <div className="mt-6 w-[80%]">
          <input
            type="file"
            onChange={handlefile}
            className="w-full border-2 border-dashed border-gray-500 py-10 px-4 text-center text-gray-400 rounded-md cursor-pointer bg-blue-700 hover:border-gray-300 transition duration-300 shadow-inner"
          />
        </div>

        <p className="mt-4 text-lg font-medium">Total Emails Uploaded: {emailList.length}</p>

        <button
          onClick={() => {
            if (!msg.trim()) {
              alert("Please write a message before sending.");
            } else if (emailList.length === 0) {
              alert("Please choose a file with email addresses.");
            } else {
              send(); // Proceed with sending if everything is valid
            }
          }}
          className="mt-6 bg-blue-900 py-3 px-6 text-white font-semibold rounded-md hover:bg-blue-800 transition duration-300 shadow-md"
        >
          {status ? "Sending..." : "Send Emails"}
        </button>
      </div>

      <div className="bg-blue-800 text-white text-center py-8 fade-in">
        <h4 className="text-2xl font-semibold tracking-wide">Why Choose BulkMail?</h4>
        <ul className="list-disc list-inside mt-6 px-10 text-left space-y-4">
          <li className="text-lg">Save time with automated bulk email delivery</li>
          <li className="text-lg">User-friendly drag-and-drop interface</li>
          <li className="text-lg">Secure and encrypted handling of contact lists</li>
          <li className="text-lg">Real-time tracking of email status and delivery reports</li>
        </ul>
      </div>

      <div className="bg-blue-900 text-white text-center py-6 shadow-lg fade-in">
        <p className="text-lg">Get started today and make your email marketing efficient and stress-free!</p>
      </div>

    </div>
  );
}

export default App;