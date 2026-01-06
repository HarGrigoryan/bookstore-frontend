import React, { useEffect, useState } from "react";
import { fetchAuthors, fetchGenres, fetchSettings, fetchSeries, fetchAwards, fetchLanguages, fetchPublishers, fetchCharacters } from "../api/api";
import type { AuthorDTO, GenreDTO, SeriesDTO, AwardDTO, LanguageDTO, PublisherDTO, CharacterDTO, SettingDTO } from "../types/types";
import type { BookCreateDTO } from "../types/RequestDTOs";
import { AuthorRole, Format } from "../types/Enums";
import { fetchWithAuth } from "../api/fetchWithAuth";
import ReactDOM from 'react-dom';


interface BookCreateModalProps {
  onClose: () => void;
  onCreated?: (book: BookCreateDTO) => void;
}

const BookCreateModal: React.FC<BookCreateModalProps> = ({ onClose, onCreated }) => {
  const [book, setBook] = useState<BookCreateDTO>({
    bookId: "",
    title: "",
    publishDate: "",
    firstPublishDate: "",
    description: "",
    format: undefined,
    price: undefined,
    isbn: "",
    authorIds: [],
    authorRoles: [],
    genreIds: [],
    settingIds: [],
    awardIds: [],
    characterIds: [],
    seriesNumber: "",
    coverImageURL: "",
  });

  const [authors, setAuthors] = useState<AuthorDTO[]>([]);
  const [genres, setGenres] = useState<GenreDTO[]>([]);
  const [settings, setSettings] = useState<SettingDTO[]>([]);
  const [series, setSeries] = useState<SeriesDTO[]>([]);
  const [awards, setAwards] = useState<AwardDTO[]>([]);
  const [languages, setLanguages] = useState<LanguageDTO[]>([]);
  const [publishers, setPublishers] = useState<PublisherDTO[]>([]);
  const [characters, setCharacters] = useState<CharacterDTO[]>([]);
  
  const [authorSearch, setAuthorSearch] = useState<string>("");
  const [genreSearch, setGenreSearch] = useState<string>("");
  const [awardSearch, setAwardSearch] = useState<string>("");
  const [characterSearch, setCharacterSearch] = useState<string>("");
  const [settingSearch, setSettingSearch] = useState<string>("");


    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
    Promise.all([
        fetchGenres(),
        fetchSeries(),
        fetchAwards(),
        fetchLanguages(),
        fetchPublishers(),
        fetchCharacters(),
        fetchSettings(),
    ]).then(([g, s, a, l, p, c, st]) => {
        setGenres(g);
        setSeries(s);
        setAwards(a);
        setLanguages(l);
        setPublishers(p);
        setCharacters(c);
        setSettings(st);
    });
    }, []);


  useEffect(() => {
    if (authorSearch.trim() === "") return;
    fetchAuthors({ fullName: authorSearch }).then(data => setAuthors(data.content));
  }, [authorSearch]);

  const handleInput = (key: keyof BookCreateDTO, value: any) => {
    setBook(prev => ({ ...prev, [key]: value }));
  };

  const handleAuthorSelect = (authorId: number, role: typeof AuthorRole[keyof typeof AuthorRole]) => {
    setBook(prev => ({
      ...prev,
      authorIds: [...(prev.authorIds || []), authorId],
      authorRoles: [...(prev.authorRoles || []), role]
    }));
  };

  const handleSubmit = async () => {
    if (!book.bookId || !book.title) {
      alert("Book ID and Title are mandatory!");
      return;
    }
    try {
      const res = await fetchWithAuth("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book)
      });
      if (!res.ok) throw new Error("Failed to create book");
      const data = await res.json();
      onCreated?.(data);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Error creating book");
    }
  };

  return ReactDOM.createPortal(
    <div
        style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 9999, 
        }}
        >
        <div
            style={{
            background: '#fff',
            padding: 20,
            borderRadius: 10,
            width: '90%',
            maxWidth: 700,
            maxHeight: '90vh',
            overflowY: 'auto',
            }}
        >
        {/* X close button */}
        <button
        onClick={onClose}
        style={{
            position: 'relative',
            top: 10,
            right: 0,
            background: 'transparent',
            border: 'none',
            fontSize: 18,
            cursor: 'pointer',
            fontWeight: 'bold',
        }}
        >
        ×
        </button>
   
        <h2 className="text-xl font-bold mb-4">Create Book</h2>

        <div className="mb-2" style={{marginBottom: 10}}>
          <label>Book ID* </label>
          <input type="text" className="border p-1 w-full" value={book.bookId} onChange={e => handleInput("bookId", e.target.value)} />
        </div>

        <div className="mb-2" style={{marginBottom: 10}}>
          <label>Title* </label>
          <input type="text" className="border p-1 w-full" value={book.title} onChange={e => handleInput("title", e.target.value)} />
        </div>

        {/* Description */}
        <div className="mb-2" style={{ marginBottom: 10 }}>
        <label>Description</label>
        <br/>
        <textarea
            className="border p-1 w-full"
            value={book.description}
            onChange={e => handleInput("description", e.target.value)}
            rows={4}
            placeholder="Enter book description..."
        />
        </div>

        {/* First Publish Date */}
        <div className="mb-2" style={{ marginBottom: 10 }}>
        <label>First Publish Date</label>
        <input
            type="date"
            className="border p-1 w-full"
            value={book.firstPublishDate ?? ""}
            onChange={e => handleInput("firstPublishDate", e.target.value)}
        />
        </div>

        {/* Publish Date */}
        <div className="mb-2" style={{ marginBottom: 10 }}>
        <label>Publish Date</label>
        <input
            type="date"
            className="border p-1 w-full"
            value={book.publishDate ?? ""}
            onChange={e => handleInput("publishDate", e.target.value)}
        />
        </div>


        <div className="mb-2" style={{ marginBottom: 10 }}>
            <label>Format</label>
            <br />
            <select
                className="border p-1 w-full"
                value={book.format || ""}
                onChange={e => handleInput("format", e.target.value as Format)}
            >
                <option value="">Select Format</option>
                {Object.values(Format).map(f => (
                <option key={f} value={f}>{f}</option>
                ))}
            </select>
        </div>

        <div className="mb-2" style={{ marginBottom: 10 }}>
            <label>Price </label>
            <input
                type="number"
                step="0.01"
                min="0"
                className="border p-1 w-full"
                value={book.price ?? ""}
                onChange={e =>
                handleInput(
                    "price",
                    e.target.value === "" ? undefined : Number(e.target.value)
                )
                }
            />
        </div>

        <div className="mb-2" style={{ marginBottom: 10 }}>
            <label>ISBN </label>
            <input
                type="text"
                className="border p-1 w-full"
                value={book.isbn}
                onChange={e => handleInput("isbn", e.target.value)}
                placeholder="ISBN-10 or ISBN-13"
            />
        </div>


        <div className="mb-2" style={{marginBottom: 10}}>
          <label>Author Search</label>
          <br/>
          <input type="text" className="border p-1 w-full" value={authorSearch} onChange={e => setAuthorSearch(e.target.value)} placeholder="Type author name..." />
          {authors.length > 0 && (
            <div className="border mt-1 p-2 max-h-40 overflow-y-auto">
              {authors.map(a => (
                <div key={a.id} className="flex justify-between items-center mb-1">
                  <span>{a.fullName}</span>
                  <select onChange={e => handleAuthorSelect(a.id, e.target.value as typeof AuthorRole[keyof typeof AuthorRole])} defaultValue="">
                    <option value="" disabled>Select Role</option>
                    {Object.entries(AuthorRole).map(([k, v]) => <option key={k} value={v}>{v}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-2" style={{marginBottom: 10}}>
          <label style={{marginRight: 10}}>Genres</label>
          <input 
            type="text" 
            placeholder="Search genres..." 
            className="border p-1 w-full mb-1" 
            value={genreSearch} 
            onChange={e => setGenreSearch(e.target.value)} 
            style={{marginBottom: 10}}
            />
            <br/>
            <select multiple className="border p-1 w-full" value={book.genreIds?.map(String)} 
                    onChange={e => handleInput("genreIds", Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                    style={{maxWidth: 700}}>
            {genres
                .filter(g => g.name.toLowerCase().includes(genreSearch.toLowerCase()))
                .map(g => <option key={g.id} value={g.id}>{g.name}</option>)
            }
            </select>
        </div>

        <div className="mb-2" style={{ marginBottom: 10 }}>
            <label style={{ marginRight: 10 }}>Settings</label>

            <input
                type="text"
                placeholder="Search settings..."
                className="border p-1 w-full mb-1"
                value={settingSearch}
                onChange={e => setSettingSearch(e.target.value)}
                style={{ marginBottom: 10 }}
            />

            <select
                multiple
                className="border p-1 w-full"
                value={book.settingIds?.map(String)}
                onChange={e =>
                handleInput(
                    "settingIds",
                    Array.from(e.target.selectedOptions, opt => Number(opt.value))
                )
                }
            >
                {settings
                .filter(s =>
                    s.name.toLowerCase().includes(settingSearch.toLowerCase())
                )
                .map(s => (
                    <option key={s.id} value={s.id}>
                    {s.name}
                    </option>
                ))}
            </select>
            </div>


        <div className="mb-2" style={{marginBottom: 10}}>
          <label style={{marginRight: 10}}>Awards</label>
          <input 
            type="text" 
            placeholder="Search awards..." 
            className="border p-1 w-full mb-1" 
            value={awardSearch} 
            onChange={e => setAwardSearch(e.target.value)} 
            style={{marginBottom: 10}}
            />
            <select multiple className="border p-1 w-full" value={book.awardIds?.map(String)} 
                    onChange={e => handleInput("awardIds", Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                    style={{maxWidth: 700}}>
            {awards
                .filter(a => a.name.toLowerCase().includes(awardSearch.toLowerCase()))
                .map(a => (
                <option key={a.id} value={a.id}>
                    {a.name}{a.year ? ` (${a.year})` : ''}
                </option>
                ))
            }
            </select>

        </div>

        <div className="mb-2" style={{marginBottom: 10}}>
          <label style={{marginRight: 10}}>Characters</label>
          <input 
            type="text" 
            placeholder="Search characters..." 
            className="border p-1 w-full mb-1" 
            value={characterSearch} 
            onChange={e => setCharacterSearch(e.target.value)} 
            style={{marginBottom: 10}}
            />
            <select multiple className="border p-1 w-full" value={book.characterIds?.map(String)} 
                    onChange={e => handleInput("characterIds", Array.from(e.target.selectedOptions, opt => Number(opt.value)))}
                    style={{maxWidth: 700}}>
            {characters
                .filter(c => c.fullName.toLowerCase().includes(characterSearch.toLowerCase()))
                .map(c => (
                <option key={c.id} value={c.id}>
                    {c.fullName}{c.comment ? ` (${c.comment})` : ''}
                </option>
                ))
            }
            </select>

        </div>

        <div className="mb-2" style={{marginBottom: 10}}>
          <label>Language</label>
          <br/>
          <select className="border p-1 w-full" value={book.languageId || ""} onChange={e => handleInput("languageId", Number(e.target.value))}>
            <option value="">Select Language</option>
            {languages.map(l => <option key={l.id} value={l.id}>{l.language}</option>)}
          </select>
        </div>

        <div className="mb-2" style={{marginBottom: 10}}>
          <label>Publisher</label>
          <br/>
          <select className="border p-1 w-full" value={book.publisherId || ""} onChange={e => handleInput("publisherId", Number(e.target.value))}>
            <option value="">Select Publisher</option>
            {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="mb-2" style={{marginBottom: 10}}>
          <label>Series</label>
          <br/>
          <select className="border p-1 w-full" value={book.seriesId || ""} onChange={e => handleInput("seriesId", Number(e.target.value))}
            style={{maxWidth: 700}}>
            <option value="">Select Series</option>
            {series.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>Create</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BookCreateModal;
