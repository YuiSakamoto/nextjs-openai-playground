import { useState } from "react";
import { Message } from "../hooks/useOpenAI";

interface ReviewFormProps {
  onGenerate: (messages: Message[]) => void;
}

const attributes = [
  "美味しい",
  "彩りが豊か",
  "栄養満点",
  "ヘルシー",
  "コスパがいい",
  "豪華に見える",
  "手作り感",
  "リピートしたい",
  "季節感がある",
];

export const ReviewForm: React.FC<ReviewFormProps> = ({ onGenerate }) => {
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [additionalText, setAdditionalText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 感想が2つ未満の場合、アラートを表示し、送信を中止
    if (selectedAttributes.length < 2) {
      alert("最低2つ以上の感想を選択してください。");
      return;
    }
    const messages: Message[] = [
      {
        role: "system",
        content:
          "あなたは日本で最も売れているグルメ記事のライターです。弁当のレビューを書いてください。渡されたテキストから、対象のお弁当が魅力的で誰もが食べたくなる文章を140文字以内で生成します。",
      },
      {
        role: "user",
        content: `${gender ? "性別:" + gender + " " : ""}${
          age ? "年齢:" + age + " " : ""
        }${selectedAttributes.join(" ")}`,
      },
    ];

    if (additionalText) {
      messages.push({ role: "user", content: additionalText });
    }

    onGenerate(messages);
  };

  const toggleAttribute = (attr: string) => {
    if (selectedAttributes.includes(attr)) {
      setSelectedAttributes(selectedAttributes.filter((a) => a !== attr));
    } else {
      setSelectedAttributes([...selectedAttributes, attr]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="gender">性別: </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">未選択</option>
          <option value="男性">男性</option>
          <option value="女性">女性</option>
        </select>
      </div>
      <div>
        <label htmlFor="age">年齢: </label>
        <select id="age" value={age} onChange={(e) => setAge(e.target.value)}>
          <option value="">選択してください</option>
          {Array.from({ length: 8 }, (_, i) => (i + 1) * 10).map((age) => (
            <option key={age} value={`${age}代`}>
              {age}代
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label className="block mb-2">感想:</label>
        <div className="flex flex-wrap">
          {attributes.map((attr) => (
            <button
              key={attr}
              type="button"
              className={`${
                selectedAttributes.includes(attr)
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 border border-blue-500"
              } rounded m-1 p-2`}
              onClick={() => toggleAttribute(attr)}
            >
              {attr}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="additionalText">追加のテキスト（任意）: </label>
        <input
          id="additionalText"
          type="text"
          value={additionalText}
          onChange={(e) => setAdditionalText(e.target.value)}
        />
      </div>
      <button type="submit">文章を生成</button>
    </form>
  );
};
