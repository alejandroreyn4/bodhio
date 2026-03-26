import React, { useState } from 'react';
import { Loader2, Upload, Trash2, Music, GripVertical } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LazyImage } from './LazyImage';

const SortableTrack = ({ track, isLight, onDelete }: { track: any, isLight: boolean, onDelete: (track: any) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: track.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center justify-between p-3 rounded-xl border ${isLight ? 'bg-gray-50 border-gray-200' : 'bg-black/50 border-white/5'}`}>
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-white">
          <GripVertical size={16} />
        </div>
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center overflow-hidden">
          {track.image ? (
            <LazyImage src={track.image} alt="" className="w-full h-full" />
          ) : (
            <Music size={16} className="text-purple-400" />
          )}
        </div>
        <div>
          <p className={`text-sm font-medium ${isLight ? 'text-gray-900' : 'text-white'}`}>{track.name}</p>
          <p className="text-xs text-gray-500">{track.category}</p>
        </div>
      </div>
      <button 
        onClick={() => onDelete(track)}
        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Elimina"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export const MusicEditor = ({ customTracks, isLight }: { customTracks: any[], isLight: boolean }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Binaural');
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [trackToDelete, setTrackToDelete] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = customTracks.findIndex((t) => t.id === active.id);
      const newIndex = customTracks.findIndex((t) => t.id === over.id);
      const newTracks = arrayMove(customTracks, oldIndex, newIndex);
      
      // Update order in Firestore
      const batch = writeBatch(db);
      newTracks.forEach((track, index) => {
        batch.update(doc(db, 'tracks', track.id), { order: index });
      });
      await batch.commit();
    }
  };

  const handleUpload = async () => {
    if (!name || !musicFile) {
      setError('Nome e file musicale sono obbligatori');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const trackId = `custom_${Date.now()}`;
      
      // Upload music file
      const musicRef = ref(storage, `Player Musicale/${trackId}_${musicFile.name}`);
      await uploadBytes(musicRef, musicFile);
      const musicUrl = await getDownloadURL(musicRef);

      // Upload image file if exists
      let imageUrl = '';
      if (imageFile) {
        const imageRef = ref(storage, `Player Musicale/images/${trackId}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Save to Firestore
      await setDoc(doc(db, 'tracks', trackId), {
        id: trackId,
        name,
        category,
        url: musicUrl,
        image: imageUrl,
        createdAt: new Date().toISOString(),
        order: customTracks.length // Add order
      });

      // Reset form
      setName('');
      setMusicFile(null);
      setImageFile(null);
    } catch (err: any) {
      console.error('Error uploading track:', err);
      setError('Errore durante il caricamento: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (track: any) => {
    try {
      await deleteDoc(doc(db, 'tracks', track.id));
      setTrackToDelete(null);
    } catch (err) {
      console.error('Error deleting track:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#1a1a1a] border-white/10'}`}>
        <h3 className={`text-lg font-medium mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Aggiungi Nuova Traccia</h3>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Nome Traccia</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLight ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-black/50 border-white/10 text-white'}`}
              placeholder="Es. Pioggia Rilassante"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Categoria</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLight ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-black/50 border-white/10 text-white'}`}
            >
              <option value="Binaural">Binaural</option>
              <option value="Solfeggio">Solfeggio</option>
              <option value="Nature">Nature</option>
              <option value="Meditation">Meditation</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>File Audio (MP3, WAV)</label>
            <input 
              type="file" 
              accept="audio/*"
              onChange={(e) => setMusicFile(e.target.files?.[0] || null)}
              className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLight ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-black/50 border-white/10 text-white'}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>Immagine Copertina (Opzionale)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLight ? 'bg-gray-50 border-gray-200 text-gray-900' : 'bg-black/50 border-white/10 text-white'}`}
            />
          </div>

          <button 
            onClick={handleUpload}
            disabled={isUploading || !name || !musicFile}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {isUploading ? 'Caricamento in corso...' : 'Carica Traccia'}
          </button>
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${isLight ? 'bg-white border-gray-200 shadow-sm' : 'bg-[#1a1a1a] border-white/10'}`}>
        <h3 className={`text-lg font-medium mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Tracce Caricate</h3>
        
        {customTracks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nessuna traccia caricata.</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={customTracks} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {customTracks.map((track) => (
                  <SortableTrack key={track.id} track={track} isLight={isLight} onDelete={setTrackToDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {trackToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 rounded-3xl border ${isLight ? 'bg-white border-gray-200' : 'bg-[#1a1a1a] border-white/10'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isLight ? 'text-gray-900' : 'text-white'}`}>Elimina Traccia</h3>
            <p className={`mb-6 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              Sei sicuro di voler eliminare la traccia "{trackToDelete.name}"? Questa azione non può essere annullata.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setTrackToDelete(null)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${isLight ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
              >
                Annulla
              </button>
              <button 
                onClick={() => handleDelete(trackToDelete)}
                className="px-4 py-2 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
