import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PuzzleComponent } from 'src/app/components/puzzle/puzzle.component';
import { PlayPageRoutingModule } from './play-routing.module';
import { PlayPage } from './play.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlayPageRoutingModule],
  declarations: [PlayPage, PuzzleComponent],
})
export class PlayPageModule {}
