import { DashboardService } from './../dashboard.service';
import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pieChartData: any;
  lineChartData: any;

  options = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, data) => {
          const dataset = data.datasets[tooltipItem.datasetIndex];
          const valor = dataset.data[tooltipItem.index];
          const label = dataset.label ? (dataset.label + ': ') : '';

          return label + this.decimalPipe.transform(valor, '1.2-2');
        }
      }
    }
  }

  constructor(
    private dashboardService: DashboardService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.configurarGraficoPizza();
    this.configurarGraficoLinha();
  }

  configurarGraficoPizza(): void {
    this.dashboardService.lancamentosPorCategoria()
      .then(dados => {
        this.pieChartData = {
          labels: dados.map(dado => dado.categoria.nome),
          datasets: [
            {
              data: dados.map(dado => dado.total),
              backgroundColor: ['#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6',
              '#DD4477', '#3366CC', '#DC3912']
            }
          ]
        };
      });
  }

  configurarGraficoLinha(): void {
    this.dashboardService.lancamentosPorDia()
      .then(dados => {
        const diasMes = this.configurarDiaMes();

        this.lineChartData = {
          labels: diasMes,
          datasets: [
            {
              label: 'Receitas',
              data: this.filtrarDados(dados, 'RECEITA', diasMes),
              borderColor: '#3366CC'
            }, {
              label: 'Despesas',
              data: this.filtrarDados(dados, 'DESPESA', diasMes),
              borderColor: '#D62B00'
            }
          ]
        };
      });
  }

  private totaisDiarios(dados, diaMes): number[] {
    const totais = [];
    diaMes.forEach(dia => {
      let total = 0;
      dados.forEach(dado => {
        if (dado.dia.getDate() === dia) {
          total = dado.total;
        }
      });
      totais.push(total);
    });
    return totais;
  }

  private filtrarDados(dados, tipo, diasMes): number[] {
    return this.totaisDiarios(
      dados.filter(dado => dado.tipo === tipo),
      diasMes
    );
  }

  private configurarDiaMes(): number[] {
    const mesReferencia = new Date();

    mesReferencia.setMonth(mesReferencia.getMonth() + 1);
    mesReferencia.setDate(0);

    const quantidade = mesReferencia.getDate();

    const dias: number[] = [];

    for (let i = 1; i <= quantidade; i++) {
      dias.push(i);
    }

    return dias;
  }
}
