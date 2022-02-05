import type { NextPage } from "next";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const JSONdata = JSON.stringify({
      appeal: e.target.appeal.value,
    });

    // Send the form data to our API and get a response.
    const res = await fetch("/api/submit", {
      // Body of the request is the JSON data we created above.
      body: JSONdata,

      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // The method is POST because we are sending data.
      method: "POST",
    });

    setSubmitted(true);

    // If the response is successful, we'll get a 200 status code.
    if (res.status === 200) {
      alert("Appeal submitted!");
    } else {
      alert("Something went wrong!");
    }
  };

  if (session && session.user.banned) {
    return (
      <main>
        <div>
          <h1>Signed in as {session.user?.name}</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
        <form onSubmit={handleSubmit} id="appeal-form">
          <label htmlFor="appeal">Why do you deserve to be unbanned?</label>
          <textarea
            name="appeal"
            id="appeal"
            form="appeal-form"
            required
            maxLength={1000}
          />

          {submitted && <input type="submit" disabled />}
          {!submitted && <input type="submit" />}
        </form>
      </main>
    );
  }

  if (session && !session.user.banned) {
    return (
      <main>
        <div>
          <h1>Signed in as {session.user?.name}</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
        <p>You aren&apost banned!</p>
      </main>
    );
  }

  return (
    <main>
      <div>
        <h1>Not signed in</h1>
        <button onClick={() => signIn("discord")}>Sign in</button>
      </div>
    </main>
  );
};

export default Home;
