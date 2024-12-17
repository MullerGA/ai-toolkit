Je vais adapter la User Story pour utiliser shadcn/ui, qui est parfaitement adapté pour ce type d'interface.

# User Story : Visualisation Interactive LLM avec shadcn/ui

**En tant que** formateur/expert en IA  
**Je veux** une interface moderne utilisant shadcn/ui pour visualiser le processus LLM  
**Afin de** présenter de manière professionnelle et cohérente les concepts de LLM

## Composants shadcn/ui à utiliser

```jsx
// Imports nécessaires
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

import { Slider } from "@/components/ui/slider"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
```

## Structure de l'Interface

```jsx
<Card className="w-full max-w-4xl mx-auto">
  <CardHeader>
    <CardTitle>Visualisation du Pipeline LLM</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Contrôles */}
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="temperature">
          Temperature: {temperature}
        </Label>
        <Slider
          id="temperature"
          min={0.1}
          max={2.0}
          step={0.1}
          value={[temperature]}
          onValueChange={([value]) => setTemperature(value)}
        />
      </div>
      {/* Autres sliders similaires */}
    </div>

    {/* Visualisation */}
    <div className="mt-6">
      <SVGFunnel />
    </div>
  </CardContent>
</Card>
```

## Exemple de Mise en Page Complète

## Points Clés d'Implémentation

1. **Structure des Composants**
```
src/
├── components/
│   ├── LLMVisualization/
│   │   ├── index.tsx
│   │   ├── FunnelSVG.tsx        // Composant SVG
│   │   └── ParameterControls.tsx // Contrôles shadcn
│   └── ui/                      // Composants shadcn importés
```

2. **Installation des Dépendances**
```bash
# Composants shadcn nécessaires
npx shadcn-ui@latest add card
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add label
```

3. **Styles Personnalisés**
```css
/* Ajustements pour shadcn */
.card {
  @apply shadow-md;
}

.slider-container {
  @apply mt-2;
}

/* Animation des points */
.token-point {
  @apply animate-pulse;
}
```

## Améliorations Possibles

1. **Interactivité Avancée**
   - Hover states sur les points avec Tooltips shadcn
   - Animation de transition sur les changements de paramètres

2. **Responsive Design**
   - Adaptation mobile du Card
   - Réorganisation des contrôles en colonnes sur petit écran

3. **Accessibilité**
   - Labels ARIA pour les contrôles
   - Messages d'état pour lecteurs d'écran

## Documentation

```markdown
# Installation
1. S'assurer que shadcn/ui est installé
2. Installer les composants nécessaires
3. Copier le composant LLMVisualization

# Utilisation
import { LLMVisualization } from '@/components/LLMVisualization'

<LLMVisualization />
```

Exemple de code: 
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const LLMVisualization = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(5);
  const [topP, setTopP] = useState(0.8);

  // Calcul du chemin de l'entonnoir
  const getFunnelPath = () => {
    const topWidth = 200 * (0.5 + temperature/2);
    const midWidth = Math.min(topWidth * 0.8, 160 * (topK/10));
    const bottomWidth = Math.min(midWidth * 0.8, 120 * topP);
    
    return `
      M ${200 - topWidth/2},50 
      C ${200 - topWidth/2},50 ${200 - midWidth/2},150 ${200 - midWidth/2},150
      L ${200 + midWidth/2},150
      C ${200 + midWidth/2},150 ${200 + topWidth/2},50 ${200 + topWidth/2},50 Z
      
      M ${200 - midWidth/2},150
      C ${200 - midWidth/2},150 ${200 - bottomWidth/2},250 ${200 - bottomWidth/2},250
      L ${200 + bottomWidth/2},250
      C ${200 + bottomWidth/2},250 ${200 + midWidth/2},150 ${200 + midWidth/2},150 Z
      
      M ${200 - bottomWidth/2},250
      C ${200 - bottomWidth/2},250 ${200 - 20},350 ${200 - 20},350
      L ${200 + 20},350
      C ${200 + 20},350 ${200 + bottomWidth/2},250 ${200 + bottomWidth/2},250 Z
    `;
  };

  // Calcul du nombre de tokens après filtrage
  const getNumTokens = () => {
    const baseProbs = [0.4, 0.3, 0.15, 0.08, 0.05, 0.02];
    let probs = baseProbs.map(p => Math.pow(p, 1/temperature));
    const sum = probs.reduce((a, b) => a + b, 0);
    probs = probs.map(p => p/sum);
    probs = probs.slice(0, topK);
    let cumSum = 0;
    return probs.filter(p => {
      cumSum += p;
      return cumSum <= topP;
    }).length;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Pipeline de Génération LLM</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <Label htmlFor="temperature">
              Temperature: {temperature.toFixed(2)}
            </Label>
            <Slider
              id="temperature"
              min={0.1}
              max={2.0}
              step={0.1}
              value={[temperature]}
              onValueChange={([value]) => setTemperature(value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topk">
              Top K: {topK}
            </Label>
            <Slider
              id="topk"
              min={1}
              max={10}
              value={[topK]}
              onValueChange={([value]) => setTopK(value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topp">
              Top P: {topP.toFixed(2)}
            </Label>
            <Slider
              id="topp"
              min={0.1}
              max={1.0}
              step={0.05}
              value={[topP]}
              onValueChange={([value]) => setTopP(value)}
            />
          </div>

          <div className="h-96 w-full">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Entonnoir */}
              <path
                d={getFunnelPath()}
                fill="#e2e8f0"
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Points représentant les tokens */}
              {[...Array(getNumTokens())].map((_, i) => (
                <circle
                  key={i}
                  cx={200 + (Math.random() - 0.5) * 40}
                  cy={50 + i * (300/Math.max(getNumTokens(), 1))}
                  r="5"
                  fill="#3b82f6"
                  className="animate-pulse"
                />
              ))}
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LLMVisualization;