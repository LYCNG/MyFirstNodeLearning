# FirstNodeLearning

## 第一次用Node.js來建立後端環境(申請和登入系統)
搭建express框架
資料庫用sqlite3

架構方式為**MVC**

*MVC（Model–view–controller）* 為軟體工程中的一種軟體架構模式。分成三個部分：

Model
主要用來處理資料的邏輯及資料庫的部分。只要是與資料相關的事情，都會交由它處理。

View
將Model的資料透過View來呈現給使用者。

Controller
藉由使用者的行為來控管及觸發特定的事件，並指示該事件所對應的Model來進行處理。

運作方式:

client request--> server request--> controller request--> module response-->controller response-->view response-->server response-->client

優點:
方便處理和維護每個程式負責運作的部分，每個程式都有自己的家，在報錯時也比較容易測試和修正，不會像寫在同一個檔案下，讓人眼花撩亂。
