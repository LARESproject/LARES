<?xml version="1.0" encoding="UTF-8"?>
<!-- $Id$ -->
<xsl:stylesheet xmlns:i18n="http://apache.org/cocoon/i18n/2.1"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:t="http://www.tei-c.org/ns/1.0"
  exclude-result-prefixes="t" version="2.0">
  <!-- Contains named templates for lares file structure (aka "metadata" aka "supporting data") -->

  <!-- Called from htm-tpl-structure.xsl -->

  <xsl:template name="lares-body-structure">
    
    <div id="metadata" class="chapter_description">
          <p><b>Original publication: </b> <xsl:apply-templates select="//t:sourceDesc//t:p[1]/node()"/></p>    
      
        <p>
          <b>Authors: </b>
          <xsl:for-each select="//t:listChange//t:change">
            <xsl:sort select="position()" order="descending"/>
            <xsl:value-of select="@who"/><xsl:text> (</xsl:text>
            <xsl:value-of select="@when"/>
            <xsl:if test="normalize-space(.)!=''"><xsl:text>: </xsl:text><xsl:value-of select="."/></xsl:if>
            <xsl:text>)</xsl:text>
            <xsl:if test="position()!=last()"><xsl:text>; </xsl:text></xsl:if>
          </xsl:for-each>
        </p>

      <p id="toggle_buttons"><b>Show/hide: </b>
        <button class="links" id="toggle_links">links</button>
        <button class="practice" id="toggle_practice">practice</button>
        <button class="belief" id="toggle_belief">belief</button>
        <button class="fiction" id="toggle_fiction">fiction</button>
        <button class="sign" id="toggle_sign">sign</button>
        <button class="sense" id="toggle_sense">sense</button>
        <button class="speech" id="toggle_speech">speech</button>
        <button class="systems" id="toggle_systems">systems</button>
        <button class="instruments" id="toggle_instruments">instruments</button>
        <button class="structures" id="toggle_structures">structures</button>
      </p>
      
      <script>
         $(document).ready(function(){
         $("#toggle_practice").click(function(){
         $(".practice").toggleClass("_practice");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_belief").click(function(){
         $(".belief").toggleClass("_belief");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_fiction").click(function(){
         $(".fiction").toggleClass("_fiction");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_sign").click(function(){
         $(".sign").toggleClass("_sign");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_sense").click(function(){
         $(".sense").toggleClass("_sense");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_speech").click(function(){
         $(".speech").toggleClass("_speech");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_systems").click(function(){
         $(".systems").toggleClass("_systems");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_instruments").click(function(){
         $(".instruments").toggleClass("_instruments");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_structures").click(function(){
         $(".structures").toggleClass("_structures");
         });
         });
         
         $(document).ready(function(){
         $("#toggle_links").click(function(){
         $(".links").toggleClass("_links");
         });
         });
       </script>
    </div>
    

    <div class="content" id="edition" data-section-content="data-section-content">
      <xsl:variable name="edtxt">
        <xsl:apply-templates select="//t:div[@type = 'edition']">
          <xsl:with-param name="parm-edition-type" select="'interpretive'" tunnel="yes"/>
        </xsl:apply-templates>
      </xsl:variable>
      <xsl:apply-templates select="$edtxt" mode="sqbrackets"/>
    </div>

    <div id="apparatus">
      <xsl:variable name="apptxt">
        <xsl:apply-templates select="//t:div[@type = 'apparatus']"/>
      </xsl:variable>
      <xsl:apply-templates select="$apptxt" mode="sqbrackets"/>
    </div>

    <xsl:if test="//t:div[@type='edition']//t:rs[@key!='']">
      <div id="keywords">
        <xsl:variable name="doc_keys">
          <xsl:for-each select="//t:div[@type='edition']//t:rs[@key!='']">
            <xsl:value-of select="lower-case(translate(@key, '#', ''))"/><xsl:if test="position()!=last()"><xsl:text> </xsl:text></xsl:if>
          </xsl:for-each>
        </xsl:variable>
        <xsl:variable name="unique_keys" select="distinct-values(tokenize($doc_keys, '\s+?'))"/>
        <xsl:variable name="sorted_keys"><xsl:for-each select="$unique_keys"><xsl:sort/><xsl:value-of select="replace(., '_', ' ')"/><xsl:if test="position()!=last()"><xsl:text>, </xsl:text></xsl:if></xsl:for-each></xsl:variable>
        <p><b><i18n:text i18n:key="epidoc-xslt-lares-keywords">Keywords</i18n:text>: </b>
          <xsl:value-of select="$sorted_keys"/><xsl:text>.</xsl:text></p>
      </div>
    </xsl:if>
    
    <div id="bibliography">
      <xsl:if test="//t:div[@type = 'bibliography']/t:p/node()">
        <p>
          <b><i18n:text i18n:key="epidoc-xslt-lares-bibliography">Bibliography</i18n:text>: </b>
          <xsl:apply-templates select="//t:div[@type = 'bibliography']/t:p"/>
        </p>
      </xsl:if>
      <xsl:if test="//t:div[@type = 'bibliography']//t:listBibl//t:bibl/node()">
        <xsl:for-each select="//t:div[@type = 'bibliography']//t:listBibl//t:bibl">
          <p><xsl:apply-templates select="."/></p>
        </xsl:for-each>
      </xsl:if>
    </div>

    <xsl:if test="//t:div[@type = 'commentary']/t:p/node()">
      <div id="commentary">
      <p><b><i18n:text i18n:key="epidoc-xslt-lares-commentary">Commentary</i18n:text></b></p>
      <xsl:variable name="commtxt">
        <xsl:apply-templates select="//t:div[@type = 'commentary']//t:p"/>
      </xsl:variable>
      <xsl:apply-templates select="$commtxt" mode="sqbrackets"/>
    </div>
    </xsl:if>
  </xsl:template>

  <xsl:template name="lares-structure">
    <xsl:variable name="title">
      <xsl:call-template name="lares-title"/>
    </xsl:variable>

    <html>
      <head>
        <title>
          <xsl:value-of select="$title"/>
        </title>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
        <!-- Found in htm-tpl-cssandscripts.xsl -->
        <xsl:call-template name="css-script"/>
      </head>
      <body>
        <h1>
          <xsl:apply-templates select="$title"/>
        </h1>
        <xsl:call-template name="lares-body-structure"/>
      </body>
    </html>
  </xsl:template>

  <xsl:template name="lares-title">
    <xsl:choose>
      <xsl:when test="//t:titleStmt/t:title/text()">
        <xsl:value-of select="//t:titleStmt/t:title"/>
      </xsl:when>
      <xsl:when test="//t:idno[@type = 'filename']/text()">
        <xsl:value-of select="//t:idno[@type = 'filename']"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:text>EpiDoc example output, LARES style</xsl:text>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <!-- all the templates below should be named or moved elsewhere -->
  <xsl:template priority="10" match="t:ref[not(@corresp)][starts-with(., 'http')]">
    <a href="{.}" target="_blank"><xsl:apply-templates/></a>
  </xsl:template>
    
  <xsl:template priority="10" match="t:ref[@corresp]">
    <xsl:apply-templates/>
    <a class="links" href="{@corresp}" target="_blank"><b> ➚</b></a>
  </xsl:template>
  
  <xsl:template priority="10" match="t:w[@lemma]">
      <b><xsl:apply-templates/></b>
      <a class="links" href="{concat('https://logeion.uchicago.edu/', @lemma)}" target="_blank"><b> ➚</b></a> 
  </xsl:template>

  <xsl:template priority="20" match="t:rs[@key][ancestor::t:div[@type='edition']]">
    <span class="popup_box">
      <span class="{@key}"><b><xsl:apply-templates/></b></span>
      <span class="popup"><xsl:value-of select="replace(@key, ' ', ', ')"/></span>
    </span>
    <a class="links" href="../indices/epidoc/realms.html#{replace(normalize-space(.), ' ', '_')}" target="_blank"><b> ➚</b></a>
  </xsl:template>
  
  <xsl:template priority="10" match="t:quote">
    <p class="quotation"><xsl:apply-templates/></p>
  </xsl:template>
  
  <xsl:template priority="10" match="t:emph">
    <xsl:choose>
      <xsl:when test="ancestor::t:quote and ancestor::t:TEI[not(starts-with(descendant::t:idno[@type='filename'], 'lexicon'))]">
        <span class="speaker"><xsl:apply-templates/></span> <!-- only in book chapters, not in lexicon entries -->
      </xsl:when>
      <xsl:when test="ancestor::t:div[@type='commentary']|ancestor::t:div[@type='bibliography']">
        <span class="emph"><xsl:apply-templates/></span>
      </xsl:when>
      <xsl:otherwise>
        <b><xsl:apply-templates /></b>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template priority="10" match="t:div[@n]">
    <div id="{@n}"><xsl:apply-templates/></div>
  </xsl:template>
  
  <xsl:template priority="10" match="t:lb[@n]">
    <xsl:choose>
      <xsl:when test="not(ancestor::t:quote)"><br/></xsl:when>
      <xsl:when test="ancestor::t:quote and (preceding-sibling::node() or normalize-space(string-join(preceding-sibling::text(), ''))!='')"><br/></xsl:when>
    </xsl:choose>
    <span class="line_number"><xsl:text>(</xsl:text><xsl:value-of select="@n"/><xsl:text>) </xsl:text></span>
  </xsl:template>
  
  <xsl:template priority="10" match="t:quote//t:lb[1][not(@n)]">
    <xsl:choose>
      <xsl:when test="not(preceding-sibling::node()) or not(normalize-space(string-join(preceding-sibling::text(), ''))!='')"></xsl:when>
      <xsl:otherwise><br/></xsl:otherwise>
    </xsl:choose>
  </xsl:template>  
  
  <xsl:template priority="10" match="t:note">
    <span class="popup_box">
      <sup class="footnote">
        <xsl:text>[</xsl:text>
        <xsl:choose>
          <xsl:when test="@n">
            <xsl:value-of select="@n"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:text>*</xsl:text>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:text>]</xsl:text>
      </sup>
      <span class="popup note"><xsl:apply-templates/></span>
    </span>
  </xsl:template>

</xsl:stylesheet>
